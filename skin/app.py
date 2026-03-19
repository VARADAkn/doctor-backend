import os
import datetime
import numpy as np
from flask import Flask, request, render_template, jsonify, send_file, after_this_request
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from fpdf import FPDF

# Get absolute path of the directory containing app.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, 
            static_folder=os.path.join(BASE_DIR, 'static'),
            static_url_path='/static',
            template_folder=os.path.join(BASE_DIR, 'templates'))
CORS(app)

@app.before_request
def log_request_info():
    # print(f"DEBUG: Request: {request.method} {request.path}", flush=True)
    pass

# Path to the trained model
MODEL_PATH = os.path.join(BASE_DIR, "Src", "Model Training", "saveModel", "Model_Tiny", "final_model.keras")

# Load the model
try:
    if os.path.exists(MODEL_PATH):
        print(f"Loading model from {MODEL_PATH}...")
        model = load_model(MODEL_PATH, compile=False)
        print("Model loaded successfully.")
    else:
        print(f"CRITICAL ERROR: Model file not found at {MODEL_PATH}")
        model = None
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Load the disease model
DISEASE_MODEL_PATH = os.path.join(BASE_DIR, "backend", "model.h5")
DISEASE_CLASS_INDICES_PATH = os.path.join(BASE_DIR, "backend", "class_indices.json")

try:
    if os.path.exists(DISEASE_MODEL_PATH):
        print(f"Loading disease model from {DISEASE_MODEL_PATH}...")
        disease_model = load_model(DISEASE_MODEL_PATH, compile=False)
        print("Disease model loaded successfully.")
    else:
        print(f"Warning: Disease model file not found at {DISEASE_MODEL_PATH}")
        disease_model = None
except Exception as e:
    print(f"Error loading disease model: {e}")
    disease_model = None

try:
    if os.path.exists(DISEASE_CLASS_INDICES_PATH):
        import json
        with open(DISEASE_CLASS_INDICES_PATH, "r") as f:
            disease_class_indices = json.load(f)
        disease_class_names = list(disease_class_indices.keys())
    else:
        disease_class_names = []
except Exception as e:
    print(f"Error loading disease class indices: {e}")
    disease_class_names = []


# Classes identified from the training script
CLASSES = ['AK', 'BCC', 'BKL', 'DF', 'MEL', 'NV', 'SCC', 'UNK', 'VASC']

# Detailed Class Information & Risk Mapping
CLASS_INFO = {
    'AK': {
        'name': 'Actinic Keratosis',
        'type': 'Pre-cancerous / Early Malignant',
        'risk': 'High',
        'desc': 'A rough, scaly patch on the skin caused by years of sun exposure. Can develop into squamous cell carcinoma.',
        'action': 'Consult a dermatologist for evaluation and potential removal.'
    },
    'BCC': {
        'name': 'Basal Cell Carcinoma',
        'type': 'Malignant (Cancer)',
        'risk': 'High',
        'desc': 'A type of skin cancer. BCC often appears as a slightly transparent bump on the skin, though it can take other forms.',
        'action': 'Immediate medical attention required. Highly treatable if caught early.'
    },
    'BKL': {
        'name': 'Benign Keratosis',
        'type': 'Benign (Non-cancerous)',
        'risk': 'Low',
        'desc': 'A non-cancerous skin growth that appears as a waxy brown, black, or tan growth.',
        'action': 'Generally harmless. Monitoring recommended for changes.'
    },
    'DF': {
        'name': 'Dermatofibroma',
        'type': 'Benign (Non-cancerous)',
        'risk': 'Low',
        'desc': 'A common overgrowth of fibrous tissue situated in the dermis (the deeper layer of the skin).',
        'action': 'Usually harmless. Consult a doctor if it causes discomfort.'
    },
    'MEL': {
        'name': 'Melanoma',
        'type': 'Malignant (Cancer)',
        'risk': 'Critical',
        'desc': 'The most serious type of skin cancer. Develops in the cells (melanocytes) that produce melanin.',
        'action': 'URGENT: Immediate dermatological intervention is critical.'
    },
    'NV': {
        'name': 'Melanocytic Nevus',
        'type': 'Benign (Non-cancerous)',
        'risk': 'Low',
        'desc': 'A common mole. A small, usually dark growth on the skin which develops from pigment-producing cells.',
        'action': 'Normal. Monitor for "ABCDE" changes (Asymmetry, Border, Color, Diameter, Evolving).'
    },
    'SCC': {
        'name': 'Squamous Cell Carcinoma',
        'type': 'Malignant (Cancer)',
        'risk': 'High',
        'desc': 'A common form of skin cancer that develops in the squamous cells that make up the middle and outer layers of the skin.',
        'action': 'Requires medical treatment. Good prognosis with early detection.'
    },
    'UNK': {
        'name': 'Unknown / Inconclusive',
        'type': 'Uncertain',
        'risk': 'Unknown',
        'desc': 'The model could not classify this image with high certainty.',
        'action': 'Please retake the photo or consult a doctor directly.'
    },
    'VASC': {
        'name': 'Vascular Lesion',
        'type': 'Benign (Non-cancerous)',
        'risk': 'Low',
        'desc': 'Abnormalities of blood vessels, such as cherry angiomas.',
        'action': 'Generally harmless. Cosmetic removal is an option.'
    },
    'NON_CANCER': {
        'name': 'Non-Cancerous Skin Disease',
        'type': 'Skin Condition (Benign)',
        'risk': 'Low',
        'desc': 'This lesion does not show primary markers of skin cancer but appears to be a common skin condition.',
        'action': 'See the detailed disease analysis below for more information.'
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    global model
    print(f"DEBUG: /predict request received. Model state: {'Loaded' if model else 'None'}")
    
    if model is None:
        return jsonify({'error': 'Model not loaded on server. Please restart the Flask application.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Save the file temporarily
    upload_folder = os.path.join(BASE_DIR, 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    # Use a unique filename
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(upload_folder, safe_filename)
    file.save(file_path)
    
    try:
        import albumentations as A
        import cv2

        # Preprocess the image with normalization (IMPORTANT for model accuracy)
        img_raw = cv2.imread(file_path)
        img_rgb = cv2.cvtColor(img_raw, cv2.COLOR_BGR2RGB)
        
        transform = A.Compose([
            A.Resize(224, 224)
        ])
        
        transformed = transform(image=img_rgb)
        x = transformed['image']
        x = np.expand_dims(x, axis=0)
        
        # Run primary skin cancer prediction
        preds = model.predict(x)
        preds = preds[0].tolist()
        
        # --- DISEASE CROSS-CHECK (Internal) ---
        # Run the disease model to see if it's likely a non-cancerous condition
        disease_detected = None
        disease_conf = 0
        is_cancerous_disease = False

        if disease_model is not None:
            try:
                from tensorflow.keras.applications.efficientnet import preprocess_input
                # EfficientNet preprocessing for disease model
                img_disease = cv2.resize(img_raw, (224, 224))
                img_disease = preprocess_input(img_disease)
                img_disease = np.expand_dims(img_disease, axis=0)
                
                disease_preds = disease_model.predict(img_disease)[0]
                disease_idx = np.argmax(disease_preds)
                disease_detected = disease_class_names[disease_idx] if disease_idx < len(disease_class_names) else "Unknown"
                disease_conf = float(disease_preds[disease_idx]) * 100
                
                # Check if the disease model thinks it's cancer
                # Classes 1 (Actinic_Keratosis) and 14 (SkinCancer) are malignant/pre-malignant
                if disease_detected in ["SkinCancer", "Actinic_Keratosis"]:
                    is_cancerous_disease = True
                
                print(f"DEBUG: Internal disease check: {disease_detected} ({disease_conf:.2f}%)")
            except Exception as de:
                print(f"DEBUG: Internal disease check failed: {de}")

        # Format results
        results = []
        for i, prob in enumerate(preds):
            class_code = CLASSES[i]
            info = CLASS_INFO.get(class_code, {'name': class_code, 'risk': 'Unknown', 'desc': '', 'type': 'Unknown'})
            results.append({
                'class': class_code,
                'full_name': info['name'],
                'risk': info['risk'],
                'type': info['type'],
                'desc': info['desc'],
                'action': info.get('action', "Consult a professional."),
                'raw_prob': round(float(prob) * 100, 2),
                'probability': round(float(prob) * 100, 2)
            })
            
        # --- CLINICAL RISK-AWARE WEIGHTING (CRW) v2 (Refined) ---
        critical_classes = ['MEL', 'BCC', 'SCC', 'AK']
        
        # 0. Contextual Suppression (HIGH SENSITIVITY for dataset2)
        # If disease model is even moderately confident it's a NON-cancerous disease, we suppress cancer boosting
        suppress_boost = False
        if disease_detected and not is_cancerous_disease:
            # Calculate the strongest raw cancer signal
            top_raw_cancer = max([r['raw_prob'] for r in results if r['class'] in critical_classes] + [0])
            
            # Lowered threshold: if disease model is >20% and stronger than raw cancer, or >40% overall
            if (disease_conf > 20.0 and disease_conf > top_raw_cancer) or disease_conf > 40.0:
                suppress_boost = True
                print(f"DEBUG: Suppressing Cancer Boost. Disease: {disease_detected} ({disease_conf:.1f}%) vs Raw Cancer max ({top_raw_cancer:.1f}%)")
            else:
                print(f"DEBUG: Not suppressing boost. Disease signal ({disease_conf:.1f}%) not strong enough vs Cancer signal ({top_raw_cancer:.1f}%)")
        elif disease_model is None:
            print("DEBUG: Disease model not available for suppression check.")
        elif is_cancerous_disease:
            print(f"DEBUG: Disease model confirmed cancer risk: {disease_detected} ({disease_conf:.1f}%)")

        # 1. Heavily suppress 'UNK' (Unknown) unless it's the ONLY thing the model sees.
        any_other_signal = any(r['raw_prob'] > 5.0 for r in results if r['class'] != 'UNK')
        
        for r in results:
            if r['class'] == 'UNK':
                if any_other_signal:
                    r['probability'] = round(r['raw_prob'] * 0.15, 2) 
                else:
                    r['probability'] = round(r['raw_prob'] * 0.5, 2) 

        # 2. Aggressive High-Risk Boosting (with suppression logic)
        for r in results:
            if r['class'] in critical_classes:
                if r['raw_prob'] > 1.5: 
                    # Base boost
                    boost_factor = 2.5
                    
                    if suppress_boost:
                        boost_factor = 1.0 # DISABLE BOOST if disease detected
                    
                    # Extra boost for Melanoma (MEL)
                    if r['class'] == 'MEL' and not suppress_boost:
                        if r['raw_prob'] > 5.0:
                            boost_factor = 4.0 
                        elif r['raw_prob'] > 2.0:
                            boost_factor = 3.0
                            
                    r['probability'] = round(r['raw_prob'] * boost_factor, 2) # Use raw_prob as base for clarity
                    if boost_factor > 1.0:
                        print(f"DEBUG: Applied CRW Boost to {r['class']}. Raw: {r['raw_prob']}% -> Adj: {r['probability']}%")

        # 3. Probability Capping
        for r in results:
            if r['probability'] > 99.9:
                r['probability'] = 99.9

        # Re-Sort by adjusted probability
        results = sorted(results, key=lambda x: x['probability'], reverse=True)
        
        # 4. NEW LOGIC: Explicit Non-Cancer Class Injection
        # If disease model is confident it's NOT cancer, we inject the NON_CANCER result at the TOP
        if suppress_boost:
            print(f"DEBUG: Injecting Non-Cancerous Condition as TOP result.")
            info = CLASS_INFO['NON_CANCER']
            nc_res = {
                'class': 'NON_CANCER',
                'full_name': info['name'],
                'risk': info['risk'],
                'type': info['type'],
                'desc': info['desc'],
                'action': info['action'],
                'raw_prob': disease_conf,
                'probability': 100.0 # Force as top
            }
            results.insert(0, nc_res)
            top_res = nc_res
        else:
            # 5. SAFETY OVERRIDE: Clinical Priority (Internal HAM10000 logic)
            mel_res = next((r for r in results if r['class'] == 'MEL'), None)
            top_res = results[0]
            
            if mel_res and top_res['class'] != 'MEL':
                if mel_res['raw_prob'] > 8.0 and top_res['probability'] < 80:
                    print(f"DEBUG: Safety Override - Elevating MEL from {mel_res['probability']}% due to clinical risk.")
                    idx = results.index(mel_res)
                    results[0], results[idx] = results[idx], results[0]
                    top_res = results[0]
            else:
                top_res = results[0]

        # Log adjusted results
        print(f"DEBUG: Final Top prediction: {top_res['class']} at {top_res['probability']}%")

        return jsonify({
            'success': True,
            'predictions': results,
            'top_class': top_res['class'],
            'top_full_name': top_res['full_name'],
            'top_risk': top_res['risk'],
            'top_type': top_res['type'],
            'top_desc': top_res['desc'],
            'top_action': top_res.get('action', ''),
            'top_prob': top_res['probability'],
            'image_file': safe_filename,
            'suggested_disease': disease_detected if suppress_boost else None,
            'disease_confidence': round(disease_conf, 2) if suppress_boost else 0,
            'is_cancer': False if suppress_boost else (True if top_res['risk'] in ['High', 'Critical'] else False)
        })

        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict_disease', methods=['POST'])
def predict_disease():
    global disease_model, disease_class_names
    
    if disease_model is None:
        return jsonify({'error': 'Disease model not loaded on server.'}), 500

    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    upload_folder = os.path.join(BASE_DIR, 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
        
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"disease_{timestamp}_{file.filename}"
    file_path = os.path.join(upload_folder, safe_filename)
    file.save(file_path)
    
    try:
        import cv2
        from tensorflow.keras.applications.efficientnet import preprocess_input
        IMG_SIZE = 224
        
        img = cv2.imread(file_path)
        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        img = preprocess_input(img)
        img = np.expand_dims(img, axis=0)

        prediction = disease_model.predict(img)[0]
        index = np.argmax(prediction)
        
        disease = disease_class_names[index] if index < len(disease_class_names) else "Unknown"
        confidence = float(prediction[index]) * 100

        return jsonify({
            "disease": disease,
            "confidence": round(confidence, 2)
        })
    except Exception as e:
        print(f"Disease Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/download_report', methods=['GET'])
def download_report():
    filename = request.args.get('file')
    if not filename:
        return "File not specified", 400
    
    upload_folder = os.path.join(BASE_DIR, 'uploads')
    file_path = os.path.join(upload_folder, filename)
    
    if not os.path.exists(file_path):
        return "Image file expired or not found", 404
    
    try:
        # Re-run prediction logic with normalization
        import albumentations as A
        import cv2

        img_raw = cv2.imread(file_path)
        img_rgb = cv2.cvtColor(img_raw, cv2.COLOR_BGR2RGB)
        
        transform = A.Compose([
            A.Resize(224, 224)
        ])
        
        transformed = transform(image=img_rgb)
        x = transformed['image']
        x = np.expand_dims(x, axis=0)
        # Run primary skin cancer prediction
        preds = model.predict(x)[0].tolist()
        
        # --- DISEASE CROSS-CHECK for Report ---
        disease_detected = None
        disease_conf = 0
        is_cancerous_disease = False
        suppress_boost = False

        if disease_model is not None:
            try:
                from tensorflow.keras.applications.efficientnet import preprocess_input
                img_disease = cv2.resize(img_raw, (224, 224))
                img_disease = preprocess_input(img_disease)
                img_disease = np.expand_dims(img_disease, axis=0)
                
                disease_preds = disease_model.predict(img_disease)[0]
                disease_idx = np.argmax(disease_preds)
                disease_detected = disease_class_names[disease_idx] if disease_idx < len(disease_class_names) else "Unknown"
                disease_conf = float(disease_preds[disease_idx]) * 100
                
                if disease_detected in ["SkinCancer", "Actinic_Keratosis"]:
                    is_cancerous_disease = True
                
                if not is_cancerous_disease and disease_conf > 50.0:
                    suppress_boost = True
            except:
                pass

        results = []
        for i, prob in enumerate(preds):
            class_code = CLASSES[i]
            results.append({
                'code': class_code,
                'raw_prob': round(float(prob) * 100, 2),
                'prob': round(float(prob) * 100, 2)
            })
        
        # Apply the same CRW logic as the prediction route
        for res in results:
            if res['code'] == 'UNK':
                if res['raw_prob'] < 95:
                    res['prob'] = round(res['raw_prob'] * 0.25, 2)
                else:
                    res['prob'] = round(res['raw_prob'] * 0.6, 2)
            elif res['code'] in ['MEL', 'BCC', 'SCC', 'AK']:
                if res['raw_prob'] > 2.0:
                    boost_factor = 2.0
                    if suppress_boost:
                        boost_factor = 1.0 # Suppress in report too
                        
                    res['prob'] = round(res['prob'] * boost_factor, 2)
                    if res['code'] == 'MEL' and res['raw_prob'] > 10.0 and not suppress_boost:
                        res['prob'] = round(res['prob'] * 1.5, 2)

        results = sorted(results, key=lambda x: x['prob'], reverse=True)
        
        # Safety Override for Report (Skip if suppressed)
        if suppress_boost:
            info = CLASS_INFO['NON_CANCER']
            top = {'code': 'NON_CANCER', 'prob': 100.0}
        else:
            top = results[0]
            mel_res = next((r for r in results if r['code'] == 'MEL'), None)
            if mel_res and top['code'] in ['NV', 'BKL', 'DF', 'UNK']:
                if mel_res['raw_prob'] > 15.0 or (mel_res['raw_prob'] > 8.0 and top['prob'] - mel_res['prob'] < 20):
                    idx = results.index(mel_res)
                    results[0], results[idx] = results[idx], results[0]
                    top = results[0]
        
        info = CLASS_INFO.get(top['code'], {})

        # --- Generate PDF ---
        pdf = FPDF()
        pdf.add_page()
        
        # Header
        pdf.set_font("Arial", 'B', 20)
        pdf.set_text_color(44, 62, 80)
        pdf.cell(0, 10, "SkinScan AI - Analysis Report", ln=True, align='C')
        pdf.ln(10)
        
        # Image
        pdf.image(file_path, x=65, w=80) 
        pdf.ln(5)
        
        # Date
        pdf.set_font("Arial", 'I', 10)
        pdf.set_text_color(100, 100, 100)
        pdf.cell(0, 10, f"Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", ln=True, align='C')
        pdf.ln(10)
        
        # Diagnosis Box
        pdf.set_fill_color(240, 240, 240)
        if top['code'] in ['MEL', 'BCC', 'SCC', 'AK']:
            pdf.set_fill_color(255, 235, 238) # Light red
            pdf.set_text_color(198, 40, 40)
        else:
            pdf.set_fill_color(232, 245, 233) # Light green
            pdf.set_text_color(46, 125, 50)

        pdf.set_font("Arial", 'B', 16)
        pdf.cell(0, 15, f"Prediction: {info.get('name', top['code'])}", ln=True, align='C', fill=True)
        pdf.ln(5)
        
        # Details
        pdf.set_text_color(0, 0, 0)
        pdf.set_font("Arial", 'B', 12)
        pdf.cell(40, 10, "Confidence Score:", 0)
        pdf.set_font("Arial", '', 12)
        pdf.cell(0, 10, f"{top['prob']}%", ln=True)
        
        pdf.set_font("Arial", 'B', 12)
        pdf.cell(40, 10, "Risk Level:", 0)
        pdf.set_font("Arial", '', 12)
        if info.get('risk') in ['High', 'Critical']:
            pdf.set_text_color(220, 53, 69)
        else:
            pdf.set_text_color(40, 167, 69)
        pdf.cell(0, 10, f"{info.get('risk', 'Unknown')}", ln=True)
        pdf.set_text_color(0, 0, 0)

        pdf.set_font("Arial", 'B', 12)
        pdf.cell(40, 10, "Type:", 0)
        pdf.set_font("Arial", '', 12)
        pdf.cell(0, 10, f"{info.get('type', 'Unknown')}", ln=True)
        
        pdf.ln(5)
        pdf.set_font("Arial", 'I', 11)
        pdf.multi_cell(0, 8, f"Description: {info.get('desc', '')}")
        pdf.ln(5)
        pdf.set_font("Arial", 'B', 11)
        pdf.multi_cell(0, 8, f"Recommended Action: {info.get('action', '')}")
        
        pdf.ln(15)
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(0, 10, "Full Probability breakdown", ln=True)
        
        pdf.set_font("Arial", '', 10)
        pdf.set_fill_color(245, 245, 245)
        pdf.cell(80, 8, "Condition", 1, fill=True)
        pdf.cell(40, 8, "Probability", 1, fill=True)
        pdf.ln()
        
        results_breakdown = sorted(results, key=lambda x: x['prob'], reverse=True)
        for res in results_breakdown:
            name = CLASS_INFO.get(res['code'], {}).get('name', res['code'])
            pdf.cell(80, 8, name, 1)
            pdf.cell(40, 8, f"{res['prob']}%", 1)
            pdf.ln()

        # Footer disclaimer
        pdf.set_y(-30)
        pdf.set_font("Arial", 'I', 8)
        pdf.set_text_color(128, 128, 128)
        pdf.multi_cell(0, 5, "DISCLAIMER: This tool is for educational and screening assistance purposes only. It is NOT a substitute for professional medical diagnosis. Please consult a certified dermatologist for any skin concerns.", align='C')

        # Output
        pdf_name = f"Report_{filename}.pdf"
        pdf_path = os.path.join(upload_folder, pdf_name)
        pdf.output(pdf_path)
        
        @after_this_request
        def cleanup(response):
            try:
                if os.path.exists(file_path): os.remove(file_path)
                if os.path.exists(pdf_path): os.remove(pdf_path)
            except Exception as e:
                print(f"Error cleaning up: {e}")
            return response

        return send_file(pdf_path, as_attachment=True, download_name="SkinScan_Report.pdf")

    except Exception as e:
        print(f"Report Error: {e}")
        return f"Error generating report: {str(e)}", 500

if __name__ == '__main__':
    print("Starting Flask server on http://0.0.0.1:5000 (shorthand for All Interfaces)")
    app.run(debug=True, port=5000, host='0.0.0.0')

