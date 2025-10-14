from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from schemas.disease import (
    DiabetesInput, StrokeInput, ParkinsonsInput, ThyroidInput,
    DepressionInput, HepatitisInput, HeartInput, KidneyInput
)
from core.predictor import DiseasePredictor

prediction_router = APIRouter()

# Disease prediction routing
disease_models = {
    "diabetes": DiabetesInput,
    "stroke": StrokeInput,
    "parkinsons": ParkinsonsInput,
    "thyroid": ThyroidInput,
    "depression": DepressionInput,
    "hepatitis": HepatitisInput,
    "heart": HeartInput,
    "kidney": KidneyInput,
}

@prediction_router.post("/predict/{disease_name}")
async def predict_disease(disease_name: str, input_data: dict):
    if disease_name not in disease_models:
        raise HTTPException(status_code=404, detail="Disease model not found")
    try:
        model_instance = disease_models[disease_name](**input_data)
        predictor = DiseasePredictor(disease_name, type(model_instance))
        return predictor.predict(model_instance)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input data: {e}")