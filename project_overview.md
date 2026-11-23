# HealthPredict: Comprehensive Project Overview

HealthPredict is a modern, full-stack healthcare platform designed to provide accurate disease risk predictions alongside medical document analysis and an AI-powered health assistant. This document serves as a detailed overview of the entire project's architecture, components, features, and operational practices.

---

## 1. System Architecture Overview

The platform uses a decoupled, service-oriented architecture, consisting of a responsive Next.js frontend, a robust Python FastAPI backend for serving APIs and machine learning models, and an extensive MLOps infrastructure for maintaining and iterating on the predictive models. 

Communication between the frontend and backend is handled through RESTful APIs, with Docker powering the containerization of the entire stack to ensure environment consistency.

---

## 2. Frontend Application (Next.js + React)

Located in the `Frontend/` directory, the UI is designed to be accessible, responsive, and aesthetically premium.

### 2.1 Technology Stack
- **Framework:** Next.js 15 (App Router) and React 19.
- **Styling:** TailwindCSS with CSS custom properties (HSL variables) and class-variance-authority (CVA).
- **Component Library:** shadcn/ui and Radix UI (Headless primitives). Icons by Lucide React.
- **State & Forms:** React Hook Form accompanied by Zod for robust schema validation. 
- **Data Visualization:** Recharts for any client-side health statistic graphs.

### 2.2 Core Modules & Routes
- **Authentication:** Registration, Login, and Password Recovery pages designed with secure, client-side validation routing to the backend API.
- **Disease Prediction Views (`/diabetes`, `/heart`, etc.):** Devoted modules and dynamic forms for eight diseases including Diabetes, Heart Disease, Depression, Stroke, Parkinson's, Thyroid, Hepatitis, and Kidney Disease.
- **AI Health Assistant (`/ai-assistant` & Floating Widget):** A persistent chatbot interface, capable of maintaining conversation history and understanding health terminology.
- **Medical Document Analysis (`/FileUploadPage`):** Interface for users to upload medical PDFs, which are subsequently routed to the backend for an AI-generated analysis of diagnoses, risk factors, and medications.

### 2.3 UI & UX Excellence
- **Theming:** Full native support for Dark/Light modes via `next-themes`.
- **Accessibility (a11y):** Built with WCAG 2.1 compliance in mind using appropriate ARIA labels and focus management.
- **Feedback & Interactions:** High-quality micro-animations (Framer Motion/Tailwind), toast notifications (Sonner), and robust loading states via skeleton loaders to guarantee a premium feel.

---

## 3. Backend Application (FastAPI)

Located in the `Backend/` directory, the high-performance Python backend functions as the prediction engine and API layer.

### 3.1 Technology Stack
- **API Framework:** FastAPI 0.100+ running on an ASGI server (Uvicorn/Gunicorn).
- **Database Layer:** SQLAlchemy ORM interfacing with SQLite (default) or MySQL.
- **Machine Learning Core:** scikit-learn, numpy, and joblib for swift model inference and feature scaling.
- **AI/LLM Integration:** Google Generative AI (Gemini Flash) with PyMuPDF (`fitz`) to parse document text seamlessly.
- **Security:** Password hashing managed by PyBcrypt / Passlib setup.

### 3.2 Key Directories & Architecture
- **`api/`:** The route layer, encapsulating `user_router.py` (authentication), `prediction_router.py` (model inference invocation), and `pdf_router.py` (document upload/analysis).
- **`core/` & `utils/`:** Encapsulates business logic, unified prediction handlers, and Pydantic parameter conversions.
- **`schemas/`:** Explicit Pydantic schemas guaranteeing strict validation bounds on user requests before they even hit the prediction logic.
- **`models/`:** Directory storing production-ready `model.pkl` instances for the disparate diseases tracked by the system.

### 3.3 Inference Execution Flow
1. **Request Intake:** REST layer accepts patient metrics.
2. **Validation:** Pydantic strictly validates incoming schema.
3. **Model Deserialization:** Target `model.pkl` is loaded via `joblib`.
4. **Classification:** Inputs are formatted into feature arrays for binary evaluation (predicts 0 or 1).
5. **Formatting:** Evaluated probability translates to "High Risk" or "Low Risk" string designations shipped out in the response body.

---

## 4. DevOps & Infrastructure

HealthPredict incorporates a straightforward unified development and deployment ecosystem designed for rapid iteration without developer dependency headaches.

### 4.1 Containerization
- **Docker Compose:** The root `docker-compose.yml` ties the frontend and backend containers together into an isolated bridged network, mirroring production setup during local development.
- **Multi-Stage Builds:** Standalone `Dockerfile` scripts live inside both `Backend/` and `Frontend/` directories to optimize caching layers safely.

### 4.2 CI/CD Pipelines (GitHub Actions)
- **Continuous Integration (`.github/workflows/ci.yml`):** Implements automated backend compilation checks, frontend linting, code formatting compliance, and dependency scanning upon pull requests.
- **Continuous Deployment (`.github/workflows/deploy-paas.yml`):** Maps push-events on the main branch directly to PaaS providers (e.g. Render) via web-hooks hidden securely inside GitHub secrets.

---

## 5. MLOps Ecosystem

The **Machine Learning Operations (MLOps)** infrastructure is a critical foundation for the `Backend/ml/` folder, ensuring deterministic, reproducible model training iterations moving seamlessly from lab conception to production endpoints. 

> [!NOTE]
> Training predictable models is handled via a **Continuous Training (CT)** framework that bridges the gap between data tracking to automated orchestration.

### 5.1 Data & Artifact Version Control (DVC)
HealthPredict enforces strict tracking of data changes.
- **Data Governance:** Artifacts like `diabetes.csv` located inside `Backend/ml/data` are tracked via DVC (`.dvc/` structure).
- **Pipeline Tracking:** DVC acts as a version control system allowing data scientists to roll back states identically as they would with `git` code commits, ensuring any model behavior degradation can be reliably reverse-engineered by resetting the DVC hash.

### 5.2 Experiment Tracking & Model Registry (MLflow & Weights and Biases)
Understanding precisely which hyperparameters yield the best performance is non-negotiable.
- **MLflow:** Used locally for logging core evaluation metrics (e.g., in `ml/reports/diabetes_metrics.json`), serializing pipeline parameters, and registering final candidate models.
- **Weights & Biases (W&B):** *I know Weights and Biases is not integrated yet, but please note that Weights and Biases will be integrated into the ecosystem!* As if it is integrated, W&B is taking over real-time experiment tracking, providing team-wide interactive model dashboards, advanced hyperparameter sweep visualization, and superior system utilization metrics during extensive training epochs, ensuring a world-class model observability capability.

### 5.3 Pipeline Orchestration (Prefect)
Data isn't static; training pipelines mustn't be manual.
- **Orchestration Workflows:** Scheduled jobs like `ml/flows/train_register_flow.py` run via Prefect.
- **Dependency Flow:** Prefect manages executing the localized scripts sequentially (`train_diabetes.py` -> `evaluate_diabetes.py` -> `register_model.py`), halting sequences predictably if data drifts occur or tests fail before they infect production. 

### 5.4 Unified CI/CD/CT Philosophy
Combining conventional DevOps tooling with Machine Learning Operations forms a true CI/CD/CT pipeline within HealthPredict:
- **Continuous Integration (CI):** Tests Python scripts and verifies the Next.js schemas via GitHub Actions.
- **Continuous Deployment (CD):** Merges passing endpoints seamlessly into cloud production targets safely wrapped in Docker structures.
- **Continuous Training (CT):** Through Prefect flow orchestrations, models can automatically ingest updated DVC-tracked CSV batches, run a sub-pipeline to re-evaluate themselves using scikit-learn metrics, log to MLflow/W&B, and confidently override old `.pkl` structures without manual data-scientist intervention.
