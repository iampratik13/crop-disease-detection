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




def model_predict(img_path, model):
    print(img_path)
    img = image.load_img(img_path, target_size=(224, 224))

    # Preprocessing the image
    x = image.img_to_array(img)
    # x = np.true_divide(x, 255)
    ## Scaling
    x=x/255
    x = np.expand_dims(x, axis=0)
   

    # Be careful how your trained model deals with the input
    # otherwise, it won't make correct prediction!
   # x = preprocess_input(x)

    preds = model.predict(x)
    max_prob = np.max(preds, axis=1)[0]
    preds_class=np.argmax(preds, axis=1)
    
    # Calculate a simple color ratio to detect if it's completely unrelated (e.g. blue sky, white wall)
    # using the true_divide array which is 0-255 before preprocessing
    img_array = image.img_to_array(img)
    r, g, b = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2]
    # Leaves typically have G > B or R > B (yellow/brown)
    # Count pixels that could plausibly be plant-like
    plant_pixels = np.logical_or(g > b + 10, r > b + 10)
    plant_ratio = np.sum(plant_pixels) / (224 * 224)
    
    print(f"Prediction logic - Max Prob: {max_prob:.4f}, Plant Pixel Ratio: {plant_ratio:.4f}")
    
    # Reject if it doesn't look like a plant at all, or if prediction confidence is too low
    if plant_ratio < 0.05 or max_prob < 0.65:
        return "Invalid_leaf_image"

    if preds_class==0:
        preds="Bacterial_spot"
    elif preds_class==1:
        preds="Early_blight"
    elif preds_class==2:
        preds="Late_blight"
    elif preds_class==3:
        preds="Leaf_Mold"
    elif preds_class==4:
        preds="Septoria_leaf_spot"
    elif preds_class==5:
        preds="Spider_mites Two-spotted_spider_mite"
    elif preds_class==6:
        preds="Target_Spot"
    elif preds_class==7:
        preds="Tomato_Yellow_Leaf_Curl_Virus"
    elif preds_class==8:
        preds="Tomato_mosaic_virus"
    else:
        preds="Healthy"
        
    
    
    return preds


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
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)

        # Make prediction
        preds = model_predict(file_path, model)
        result=preds
        return result
    return None


if __name__ == '__main__':
    app.run(port=5001,debug=True)
