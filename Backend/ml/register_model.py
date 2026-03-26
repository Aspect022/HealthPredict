import argparse
import json

import joblib
import mlflow
import mlflow.sklearn

from ml.config import config


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-path", required=True)
    parser.add_argument("--metrics-path", required=True)
    parser.add_argument("--model-name", default="healthpredict-diabetes")
    parser.add_argument("--alias", default="staging")
    return parser.parse_args()


def register_model(model_path: str, metrics_path: str, model_name: str, alias: str):
    abs_model_path = config.project_root / model_path
    abs_metrics_path = config.project_root / metrics_path
    if not abs_model_path.exists():
        raise FileNotFoundError(f"Model artifact not found at {abs_model_path}")
    if not abs_metrics_path.exists():
        raise FileNotFoundError(f"Metrics not found at {abs_metrics_path}")

    metrics = json.loads(abs_metrics_path.read_text(encoding="utf-8"))
    mlflow.set_tracking_uri(config.mlflow_tracking_uri)
    mlflow.set_experiment(config.mlflow_experiment)

    with mlflow.start_run(run_name="register_diabetes_model") as run:
        model = joblib.load(abs_model_path)
        mlflow.log_metrics(metrics)
        mlflow.log_artifact(str(abs_metrics_path), artifact_path="reports")
        mlflow.sklearn.log_model(sk_model=model, artifact_path="model")

        model_uri = f"runs:/{run.info.run_id}/model"
        registered = mlflow.register_model(model_uri=model_uri, name=model_name)
        client = mlflow.tracking.MlflowClient()
        client.set_registered_model_alias(model_name, alias, registered.version)
        return registered.version


if __name__ == "__main__":
    args = parse_args()
    version = register_model(args.model_path, args.metrics_path, args.model_name, args.alias)
    print(f"Registered model version: {version}")
