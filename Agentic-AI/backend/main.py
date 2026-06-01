import os
import json
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI(title="Leaf Disease Identification API")

# Setup CORS so the React frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the AI model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../best_model.h5")

try:
    if os.path.exists(MODEL_PATH):
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully.")
    else:
        model = None
        print("Warning: best_model.h5 not found in the parent directory.")
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

# ==============================================================================
# 1. Update with your actual class names (in the exact order your model predicts)
CLASS_NAMES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Northern_Leaf_Blight", "Corn_(maize)___healthy",
    "Grape___Black_rot", "Grape___Esca_(Black_Measles)", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)", "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew", "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite", "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
]

# 2. Update to match the resolution your model expects (e.g., 224x224 or 256x256)
IMAGE_SIZE = (256, 256)

def load_recommendations():
    treatments_file = os.path.join(BASE_DIR, "disease_treatments.json")
    try:
        with open(treatments_file, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: Could not load disease_treatments.json: {e}")
        return {}
# ==============================================================================

def read_file_as_image(data) -> np.ndarray:
    # Read image, RGB, resize
    image = Image.open(BytesIO(data)).convert('RGB')
    image = image.resize(IMAGE_SIZE)
    image_np = np.array(image)
    
    # Note: Depending on how your model was trained, you might need to normalize here.
    # e.g., image_np = image_np / 255.0  (Uncomment if your model expects inputs between 0 and 1)
    return image_np

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        return {"error": "Model not found or failed to load. Please ensure best_model.h5 is in the workspace root."}
    
    try:
        # 1. Process image
        image = read_file_as_image(await file.read())
        
        # 2. Add batch dimension (model expects shape [1, width, height, channels])
        img_batch = np.expand_dims(image, 0)
        
        # 3. Make prediction
        predictions = model.predict(img_batch)
        
        # 4. Get class and confidence
        predicted_index = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        
        if predicted_index < len(CLASS_NAMES):
            predicted_class = CLASS_NAMES[predicted_index]
        else:
            predicted_class = f"Unknown Class #{predicted_index}"
            
        # 5. Fetch recommendation dynamically
        recommendations_dict = load_recommendations()
        recommendation = recommendations_dict.get(predicted_class, "No recommendation available for this disease.")
        
        return {
            "class": predicted_class,
            "confidence": confidence,
            "recommendation": recommendation
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)