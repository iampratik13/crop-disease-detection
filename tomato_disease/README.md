# Tomato Disease Detection

A Flask-based web application that uses a deep learning model (InceptionV3) to detect diseases in tomato plants.

## Setup Complete

The project has been configured with:
- ✅ Required directories created (`templates/`, `static/`, `uploads/`)
- ✅ Dependencies installed (Flask, TensorFlow, NumPy, Pillow, Werkzeug)
- ✅ HTML/CSS/JS files moved to correct locations

## ⚠️ Missing Model File

**IMPORTANT**: The trained model file `model_inception.h5` is not present in the repository. 

You need to either:
1. Download the pre-trained model if it's available elsewhere
2. Train your own model and place it in the root directory
3. Update the `MODEL_PATH` in `app.py` to point to your model file location

## Installation

```bash
# Install dependencies
pip3 install -r requirements.txt
```

## Running the Application

```bash
# Start the Flask server
python3 app.py
```

The application will be available at: http://localhost:5001

## Disease Classes

The model can detect the following tomato plant conditions:
1. Bacterial Spot
2. Early Blight
3. Late Blight
4. Leaf Mold
5. Septoria Leaf Spot
6. Spider Mites (Two-spotted spider mite)
7. Target Spot
8. Tomato Yellow Leaf Curl Virus
9. Tomato Mosaic Virus
10. Healthy

## Project Structure

```
tomato_disease/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── templates/            # HTML templates
│   ├── index.html
│   └── base.html
├── static/              # CSS and JavaScript files
│   ├── main.css
│   └── main.js
├── uploads/             # Uploaded images directory
└── model_inception.h5   # ⚠️ MISSING - Required model file
```

## Author

Created by Divyansh Mathur
