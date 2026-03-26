# ML Workspace

This folder contains the production-oriented ML workflow for HealthPredict.

## Scope
- Deterministic training and evaluation for the diabetes model.
- Experiment tracking via MLflow.
- Data/model artifact versioning via DVC.
- Pipeline orchestration via Prefect (see `flows/`).

## Quick start
1. Place dataset at `Backend/ml/data/diabetes.csv`.
2. Run training:
   `python -m ml.train_diabetes`
3. Run evaluation:
   `python -m ml.evaluate_diabetes --model-path models/diabetes/model.pkl`
4. Register trained model:
   `python -m ml.register_model --model-path models/diabetes/model.pkl --metrics-path ml/reports/diabetes_metrics.json`
