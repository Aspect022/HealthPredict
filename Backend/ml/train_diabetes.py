import argparse
from pathlib import Path

import joblib
import mlflow
import mlflow.sklearn
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score
from sklearn.model_selection import train_test_split

from ml.config import config

FEATURE_ORDER = [
    "gender",
    "age",
    "hypertension",
    "heart_disease",
    "smoking_history",
    "bmi",
    "HbA1c_level",
    "blood_glucose_level",
]
LABEL_COL = "target"


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--n-estimators", type=int, default=300)
    parser.add_argument("--max-depth", type=int, default=8)
    parser.add_argument("--min-samples-split", type=int, default=4)
    return parser.parse_args()


def run_training(n_estimators: int, max_depth: int, min_samples_split: int):
    data_path = config.abs_path(config.data_path)
    if not data_path.exists():
        raise FileNotFoundError(f"Dataset not found at {data_path}")

    df = pd.read_csv(data_path)
    missing = [col for col in FEATURE_ORDER + [LABEL_COL] if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in dataset: {missing}")

    X = df[FEATURE_ORDER]
    y = df[LABEL_COL]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=config.test_size, random_state=config.random_state, stratify=y
    )

    mlflow.set_tracking_uri(config.mlflow_tracking_uri)
    mlflow.set_experiment(config.mlflow_experiment)

    with mlflow.start_run(run_name="train_diabetes_rf"):
        model = RandomForestClassifier(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            random_state=config.random_state,
        )
        model.fit(X_train, y_train)

        pred = model.predict(X_test)
        prob = model.predict_proba(X_test)[:, 1]
        metrics = {
            "accuracy": float(accuracy_score(y_test, pred)),
            "f1": float(f1_score(y_test, pred)),
            "roc_auc": float(roc_auc_score(y_test, prob)),
        }
        mlflow.log_params(
            {
                "n_estimators": n_estimators,
                "max_depth": max_depth,
                "min_samples_split": min_samples_split,
                "random_state": config.random_state,
                "test_size": config.test_size,
            }
        )
        mlflow.log_metrics(metrics)
        mlflow.sklearn.log_model(model, artifact_path="model")

    model_path = config.abs_path(config.model_output_path)
    model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, model_path)

    report_dir = config.abs_path(config.reports_dir)
    report_dir.mkdir(parents=True, exist_ok=True)
    metrics_path = report_dir / "diabetes_metrics.json"
    metrics_path.write_text(pd.Series(metrics).to_json(), encoding="utf-8")
    return str(model_path), str(metrics_path), metrics


if __name__ == "__main__":
    args = parse_args()
    model_path, metrics_path, metrics = run_training(
        args.n_estimators, args.max_depth, args.min_samples_split
    )
    print(f"Model saved to: {model_path}")
    print(f"Metrics saved to: {metrics_path}")
    print(f"Metrics: {metrics}")
