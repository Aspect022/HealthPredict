import argparse
import json

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score

from ml.config import config
from ml.train_diabetes import FEATURE_ORDER, LABEL_COL


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-path", default=str(config.model_output_path))
    return parser.parse_args()


def evaluate(model_path: str):
    candidate_path = config.project_root / model_path
    abs_model_path = candidate_path if candidate_path.exists() else config.abs_path(config.model_output_path)

    data_path = config.abs_path(config.data_path)
    if not data_path.exists():
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    model = joblib.load(abs_model_path)
    df = pd.read_csv(data_path)
    X = df[FEATURE_ORDER]
    y = df[LABEL_COL]

    pred = model.predict(X)
    prob = model.predict_proba(X)[:, 1] if hasattr(model, "predict_proba") else pred
    metrics = {
        "accuracy": float(accuracy_score(y, pred)),
        "precision": float(precision_score(y, pred)),
        "recall": float(recall_score(y, pred)),
        "f1": float(f1_score(y, pred)),
        "roc_auc": float(roc_auc_score(y, prob)),
    }
    report_dir = config.abs_path(config.reports_dir)
    report_dir.mkdir(parents=True, exist_ok=True)
    metrics_path = report_dir / "diabetes_metrics.json"
    metrics_path.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics_path, metrics


if __name__ == "__main__":
    args = parse_args()
    metrics_path, metrics = evaluate(args.model_path)
    print(f"Metrics saved to: {metrics_path}")
    print(f"Metrics: {metrics}")
