# -*- coding: utf-8 -*-
from __future__ import division, print_function
# coding=utf-8
import sys
import os
import glob
import re
import numpy as np
import tensorflow as tf

from tensorflow.compat.v1 import ConfigProto
from tensorflow.compat.v1 import InteractiveSession

config = ConfigProto()
config.gpu_options.per_process_gpu_memory_fraction = 0.5
config.gpu_options.allow_growth = True
session = InteractiveSession(config=config)
# Keras
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Flask utils
from flask import Flask, redirect, url_for, request, render_template
from werkzeug.utils import secure_filename
from flask_cors import CORS
#from gevent.pywsgi import WSGIServer

# Define a flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Model saved with Keras model.save()
MODEL_PATH = 'model_inception.h5'


# Load your trained model
try:
    model = load_model(MODEL_PATH)
    print(f"✓ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"✗ Error loading model from {MODEL_PATH}")
    print(f"  Error: {e}")
    print(f"  Please ensure the model file exists in the project directory")
    model = None


def is_leaf_image(img_path):
    """
    Robust OpenCV-based validation to determine if the image contains a leaf.
    Uses multi-layered analysis: HSV/LAB color segmentation, contour analysis,
    shape validation (solidity, aspect ratio), texture and edge density checks.
    """
    import cv2
    
    try:
        # Read image with OpenCV
        img = cv2.imread(img_path)
        if img is None:
            return False, "Could not read image file."
        
        # Resize for consistent processing
        img_resized = cv2.resize(img, (224, 224))
        height, width = img_resized.shape[:2]
        total_pixels = height * width
        
        # 1. Color Variance Check (reject flat/solid images)
        b_std = np.std(img_resized[:,:,0])
        g_std = np.std(img_resized[:,:,1])
        r_std = np.std(img_resized[:,:,2])
        avg_std = (b_std + g_std + r_std) / 3.0
        if avg_std < 12:
            return False, f"Flat color / empty image (avg_std={avg_std:.1f} < 12)"
        
        # 2. Tight Plant-Color Mask in HSV Space
        hsv = cv2.cvtColor(img_resized, cv2.COLOR_BGR2HSV)
        
        # Green leaf colors: Hue 30-85, Saturation 40-255, Value 40-255
        mask_green = cv2.inRange(hsv, np.array([30, 40, 40]), np.array([85, 255, 255]))
        # Yellowish/diseased: Hue 18-30, Saturation 45-255, Value 50-255
        mask_yellow = cv2.inRange(hsv, np.array([18, 45, 50]), np.array([30, 255, 255]))
        # Brown/dry leaf spots: Hue 8-18, Saturation 45-255, Value 40-200
        mask_brown = cv2.inRange(hsv, np.array([8, 45, 40]), np.array([18, 255, 200]))
        
        plant_mask = cv2.bitwise_or(mask_green, mask_yellow)
        plant_mask = cv2.bitwise_or(plant_mask, mask_brown)
        
        # Morphological operations to clean up
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        plant_mask = cv2.morphologyEx(plant_mask, cv2.MORPH_CLOSE, kernel, iterations=2)
        plant_mask = cv2.morphologyEx(plant_mask, cv2.MORPH_OPEN, kernel, iterations=1)
        
        plant_pixels = cv2.countNonZero(plant_mask)
        plant_ratio = plant_pixels / total_pixels
        
        # Leaf should occupy 12% to 90% of the image
        if plant_ratio < 0.12:
            return False, f"Not enough plant-colored pixels ({plant_ratio:.3f} < 0.12)"
        if plant_ratio > 0.90:
            return False, f"Too much uniform plant color ({plant_ratio:.3f} > 0.90). Likely solid backdrop/shirt."
        
        # 3. LAB space color verification (true green vs. warm colors/skin tones)
        lab = cv2.cvtColor(img_resized, cv2.COLOR_BGR2LAB)
        a_channel = lab[:,:,1]
        mean_a_in_mask = np.mean(a_channel[plant_mask > 0])
        # A true leaf is green, meaning LAB a* should be well below 124.0. Skin, peach, orange shirts are > 125.0.
        if mean_a_in_mask > 124.0:
            return False, f"Masked region is not plant-green in LAB space (mean_a={mean_a_in_mask:.1f} > 124.0)"
            
        # 4. Texture verification (Laplacian variance)
        gray = cv2.cvtColor(img_resized, cv2.COLOR_BGR2GRAY)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        texture_var = np.var(laplacian)
        if texture_var < 80:
            return False, f"Too smooth/blurry for a leaf (texture_var={texture_var:.1f} < 80)"
            
        # 5. Edge density verification
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.mean(edges > 0)
        if edge_density < 0.03:
            return False, f"Too few edges for a leaf texture (edge_density={edge_density:.3f} < 0.03)"
            
        # 6. Contour analysis (solidity and area)
        contours, _ = cv2.findContours(plant_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return False, "No contours found in plant mask."
            
        largest = max(contours, key=cv2.contourArea)
        largest_area = cv2.contourArea(largest)
        largest_area_ratio = largest_area / total_pixels
        
        if largest_area_ratio < 0.08:
            return False, f"Largest plant region is too small ({largest_area_ratio:.3f} < 0.08)"
            
        hull = cv2.convexHull(largest)
        hull_area = cv2.contourArea(hull)
        solidity = largest_area / hull_area if hull_area > 0 else 0
        
        # Real leaf solidity typically 0.30 to 0.98
        if solidity < 0.30:
            return False, f"Shape is too fragmented (solidity={solidity:.3f} < 0.30)"
        if solidity > 0.98:
            return False, f"Shape is too geometrically perfect (solidity={solidity:.3f} > 0.98)"
            
        print(f"  ✓ Leaf validation passed: ratio={plant_ratio:.3f}, LAB_a={mean_a_in_mask:.1f}, "
              f"texture={texture_var:.1f}, edge={edge_density:.3f}, solidity={solidity:.3f}")
        return True, "Valid leaf image"
    except Exception as e:
        return False, f"Error during validation: {str(e)}"


def model_predict(img_path, model):
    print(f"\n{'='*50}")
    print(f"Processing: {img_path}")
    
    # Step 1: Validate if image contains a leaf
    is_leaf, reason = is_leaf_image(img_path)
    if not is_leaf:
        print(f"  ✗ Rejected: {reason}")
        return "Invalid_leaf_image"
    
    # Step 2: Run model prediction
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = x / 255
    x = np.expand_dims(x, axis=0)

    preds = model.predict(x)
    max_prob = np.max(preds, axis=1)[0]
    preds_class = np.argmax(preds, axis=1)
    
    print(f"  Model prediction - Class: {preds_class[0]}, Confidence: {max_prob:.4f}")
    
    # Step 3: Confidence gating - reject low-confidence predictions
    if max_prob < 0.75:
        print(f"  ✗ Rejected: Confidence too low ({max_prob:.4f} < 0.75)")
        return "Invalid_leaf_image"

    # Step 4: Map to disease name
    class_names = {
        0: "Bacterial_spot",
        1: "Early_blight",
        2: "Late_blight",
        3: "Leaf_Mold",
        4: "Septoria_leaf_spot",
        5: "Spider_mites Two-spotted_spider_mite",
        6: "Target_Spot",
        7: "Tomato_Yellow_Leaf_Curl_Virus",
        8: "Tomato_mosaic_virus",
        9: "Healthy",
    }
    
    result = class_names.get(preds_class[0], "Invalid_leaf_image")
    print(f"  ✓ Result: {result} (confidence: {max_prob:.4f})")
    print(f"{'='*50}")
    return result


@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('index.html')


@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if model is None:
        return "Error: Model file not found. Please add model_inception.h5 to the project directory.", 500
    
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        uploads_dir = os.path.join(basepath, 'uploads')
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)
        
        file_path = os.path.join(uploads_dir, secure_filename(f.filename))
        f.save(file_path)

        # Make prediction
        preds = model_predict(file_path, model)
        result=preds
        return result
    return None


if __name__ == '__main__':
    app.run(port=5001,debug=True)
