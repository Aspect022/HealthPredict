# predictor.py
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from predict_utils import (
    load_model,
    make_prediction,
    make_probability,
    ordered_features,
    get_model_metadata,
)
from pydantic import BaseModel
from typing import Type


class DiseasePredictor:
    def __init__(self, disease_name: str, input_model: Type[BaseModel]):
        self.disease_name = disease_name
        self.input_model = input_model
        self.model_metadata = get_model_metadata(disease_name)
        try:
            self.model = load_model(disease_name)
        except FileNotFoundError as e:
            raise HTTPException(status_code=404, detail=str(e))

    def predict(self, input_data: BaseModel):
        try:
            feature_order = self.model_metadata.get("feature_order")
            features = ordered_features(input_data, feature_order)
            prediction = make_prediction(self.model, features)
            probability = make_probability(self.model, features)
            return JSONResponse(content={
                "disease": self.disease_name,
                "prediction": int(prediction),
                "risk_status": "High Risk" if prediction == 1 else "Low Risk",
                "probability": probability,
                "model_version": self.model_metadata.get("model_version", "unknown"),
                "schema_version": self.model_metadata.get("schema_version", "v1"),
            })
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
