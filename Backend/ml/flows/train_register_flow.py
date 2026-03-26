from prefect import flow, task

from ml.evaluate_diabetes import evaluate
from ml.register_model import register_model
from ml.train_diabetes import run_training


@task
def train_task():
    model_path, metrics_path, metrics = run_training(
        n_estimators=300,
        max_depth=8,
        min_samples_split=4,
    )
    return model_path, metrics_path, metrics


@task
def evaluate_task(model_path: str):
    metrics_path, metrics = evaluate(model_path)
    return str(metrics_path), metrics


@task
def promote_gate(metrics: dict, min_roc_auc: float = 0.75, min_f1: float = 0.65):
    return metrics.get("roc_auc", 0.0) >= min_roc_auc and metrics.get("f1", 0.0) >= min_f1


@task
def register_task(model_path: str, metrics_path: str, alias: str = "staging"):
    return register_model(
        model_path=model_path,
        metrics_path=metrics_path,
        model_name="healthpredict-diabetes",
        alias=alias,
    )


@flow(name="healthpredict-diabetes-train-register")
def train_register_flow(auto_promote: bool = False):
    model_path, _, _ = train_task()
    metrics_path, metrics = evaluate_task(model_path)
    passed = promote_gate(metrics)
    if auto_promote and passed:
        version = register_task(model_path, metrics_path, alias="production")
        return {"status": "promoted", "version": version, "metrics": metrics}
    if passed:
        version = register_task(model_path, metrics_path, alias="staging")
        return {"status": "registered_staging", "version": version, "metrics": metrics}
    return {"status": "rejected", "metrics": metrics}


if __name__ == "__main__":
    print(train_register_flow(auto_promote=False))
