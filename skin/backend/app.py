from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import json

from tensorflow.keras.applications.efficientnet import preprocess_input

IMG_SIZE = 224

try:
    model = tf.keras.models.load_model("model.h5")
except Exception as e:
    print(f"Warning: Could not load model.h5. Error: {e}")
    model = None

try:
    with open("class_indices.json") as f:
        class_indices = json.load(f)
    class_names = list(class_indices.keys())
except Exception as e:
    print(f"Warning: Could not load class_indices.json. Error: {e}")
    class_names = []

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({
            "error": "Model not loaded. Please ensure a valid model.h5 exists in the backend directory."
        }), 500

    file = request.files["file"]
    filepath = "temp.jpg"
    file.save(filepath)

    img = cv2.imread(filepath)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = preprocess_input(img)
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)[0]
    index = np.argmax(prediction)
    disease = class_names[index] if index < len(class_names) else "Unknown"
    confidence = float(prediction[index]) * 100

    return jsonify({
        "disease": disease,
        "confidence": round(confidence, 2)
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")
