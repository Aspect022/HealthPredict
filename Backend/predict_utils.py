import os
import json
import joblib
import numpy as np

from config import settings


def _load_manifest():
    manifest_path = settings.model_manifest_path
    if not manifest_path.exists():
        return {}
    with open(manifest_path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_model_metadata(disease_name):
    manifest = _load_manifest()
    return manifest.get(disease_name, {})


def _resolve_model_path(disease_name):
    metadata = get_model_metadata(disease_name)
    relative_path = metadata.get("artifact_path", f"{disease_name}/model.pkl")
    return settings.model_base_dir / relative_path


def load_model(disease_name):
    model_path = _resolve_model_path(disease_name)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"No model found for {disease_name}")

    model = joblib.load(model_path)
    return model


def ordered_features(input_data, expected_order=None):
    payload = input_data.model_dump()
    if expected_order:
        missing = [key for key in expected_order if key not in payload]
        if missing:
            raise ValueError(f"Missing required fields for ordered feature build: {missing}")
        return [payload[key] for key in expected_order]
    return [payload[key] for key in input_data.model_fields.keys()]


def make_prediction(model, features):
    features_array = np.array(features).reshape(1, -1)
    prediction = model.predict(features_array)[0]
    return prediction


def make_probability(model, features):
    features_array = np.array(features).reshape(1, -1)
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(features_array)[0]
        return float(np.max(probs))
    return None