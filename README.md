# HealthPredict

HealthPredict is a full-stack healthcare risk prediction platform with:
- FastAPI backend for disease inference and PDF analysis.
- Next.js frontend for patient-facing risk forms and AI summaries.
- MLOps baseline (MLflow + DVC + Prefect) for reproducible training, tracking, and model promotion.
- DevOps baseline for CI, containerization, and PaaS deployment hooks.

## Repository layout
- `Backend/`: FastAPI API, ML inference, training and pipeline code.
- `Frontend/`: Next.js UI and API routes.
- `.github/workflows/`: CI and deployment workflows.

## Configuration
Do not commit secrets. Use:
- `Backend/.env.example`
- `Frontend/.env.example`

Copy each to local env files and set real values.

## MLOps workflow (diabetes vertical slice)
1. Add diabetes dataset to `Backend/ml/data/diabetes.csv`.
2. Track dataset with DVC:
   - `cd Backend`
   - `dvc add ml/data/diabetes.csv`
3. Train model with MLflow tracking:
   - `python -m ml.train_diabetes`
4. Evaluate trained model:
   - `python -m ml.evaluate_diabetes --model-path models/diabetes/model.pkl`
5. Register model in MLflow:
   - `python -m ml.register_model --model-path models/diabetes/model.pkl --metrics-path ml/reports/diabetes_metrics.json`
6. Run orchestration flow:
   - `python -m ml.flows.train_register_flow`

## Inference contract
Prediction responses include:
- `prediction`
- `risk_status`
- `probability` (if estimator supports `predict_proba`)
- `model_version`
- `schema_version`

Model routing metadata lives in:
- `Backend/models/manifest.json`

## Local development
- Backend:
  - `cd Backend`
  - `pip install -r requirements.txt`
  - `uvicorn main:app --reload`
- Frontend:
  - `cd Frontend`
  - `npm install`
  - `npm run dev`

## Containerized development
Use Docker Compose at repo root:
- `docker compose up --build`

## CI/CD
- CI workflow: `.github/workflows/ci.yml`
  - Backend compile check
  - Frontend lint/build checks
  - Secret/dependency scanning
- Deploy workflow: `.github/workflows/deploy-paas.yml`
  - Triggers Render-style deploy hooks via GitHub secrets.

## Operations runbook
See `docs/ROLLBACK_RUNBOOK.md` for rollback and incident-response guidance.
