import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import os
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

app = FastAPI(
    title="Investly Apartment Price Predictor",
    description="A service to predict apartment prices in Alexandria, Egypt.",
    version="2.0.0",
)

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# --- Pydantic Models for Data Validation ---

class ApartmentFeatures(BaseModel):
    district: str = Field(..., example="Smouha")
    rooms: int = Field(..., example=3)
    baths: int = Field(..., example=2)
    size_in_meters: float = Field(..., alias="Size in Meters", example=150)
    floor: int = Field(..., example=10)
    finish_type: str = Field(..., alias="Finish Type", example="Super Lux")
    view: str = Field(..., alias="View", example="Sea View")
    year_built: int = Field(..., alias="Year Built", example=2010)

class PredictionResponse(BaseModel):
    predicted_price: float


# --- Model and Data Loading ---
# Get the directory of the current script to build robust paths
# This makes the paths work regardless of where the server is started from
CURRENT_DIR = Path(__file__).parent
BACKEND_DIR = CURRENT_DIR.parent # Move up from /predictor to /backend

MODEL_PATH = os.getenv("MODEL_PATH", str("price_predictor_model.pkl"))
DISTRICT_DATA_PATH = os.getenv("DISTRICT_DATA_PATH", str(BACKEND_DIR / "data/district_df.csv"))

model = None
district_price_map = {}

@app.on_event("startup")
def load_resources():
    """Load the model and district data at application startup."""
    global model, district_price_map
    
    # Load Model
    try:
        model = joblib.load(MODEL_PATH)
        print(f"Model loaded successfully from {MODEL_PATH}")
    except FileNotFoundError:
        print(f"CRITICAL: Model file not found at {MODEL_PATH}. The /predict endpoint will not work.")
    except Exception as e:
        print(f"An error occurred while loading the model: {e}")

    # Load District Data
    try:
        district_df = pd.read_csv(DISTRICT_DATA_PATH)
        # Strip whitespace from District names to prevent lookup errors
        district_df['District'] = district_df['District'].str.strip()
        # Create a mapping from district name to average price per meter
        district_price_map = pd.Series(district_df.AvgPricePerMeter.values, index=district_df.District).to_dict()
        print(f"District data loaded successfully from {DISTRICT_DATA_PATH}")
    except FileNotFoundError:
        print(f"CRITICAL: District data file not found at {DISTRICT_DATA_PATH}. District name lookup will fail.")
    except Exception as e:
        print(f"An error occurred while loading the district data: {e}")


# --- API Endpoints ---
@app.get("/", tags=["General"])
def read_root():
    return {"message": "Welcome to the Apartment Price Prediction API"}

@app.get("/health", tags=["General"])
def health_check():
    model_loaded = model is not None
    data_loaded = bool(district_price_map)
    return {"status": "healthy", "model_loaded": model_loaded, "district_data_loaded": data_loaded}

@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(request: ApartmentFeatures):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded. Check server logs.")
    if not district_price_map:
        raise HTTPException(status_code=503, detail="District data is not loaded. Check server logs.")

    try:
        # --- 1. District Name to Value Conversion ---
        district_value = district_price_map.get(request.district)
        if district_value is None:
            raise HTTPException(status_code=400, detail=f"District '{request.district}' not found.")

        # --- 2. Feature Preparation ---
        # The ColumnTransformer in the pickled model will handle the encoding of 'Finish Type' and 'View'.
        # We must pass the raw string values directly to it.
        features = {
            'DistrictValue': district_value,
            'Rooms': request.rooms,
            'Baths': request.baths,
            'Size in Meters': request.size_in_meters,
            'Floor': request.floor,
            'Finish Type': request.finish_type, # Pass the raw string
            'View': request.view,             # Pass the raw string
            'Year Built': request.year_built
        }
        
        features_df = pd.DataFrame([features])

        # --- 3. Prediction ---
        prediction = model.predict(features_df)
        predicted_price = prediction[0]

        return PredictionResponse(predicted_price=predicted_price)

    except HTTPException as e:
        # Re-raise HTTPException to ensure FastAPI handles it
        raise e
    except Exception as e:
        # Catch any other exceptions and return a generic server error
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}") 