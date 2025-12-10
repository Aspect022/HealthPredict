# HealthPredict Backend 🔬

The backend for HealthPredict is built with **FastAPI**, a modern, high-performance Python web framework. It provides a robust API for health prediction services powered by machine learning models.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Disease Prediction Models](#disease-prediction-models)
- [Database Schema](#database-schema)
- [Development](#development)

## 🎯 Overview

The backend serves as the core engine of HealthPredict, providing:
- **RESTful API** endpoints for disease prediction
- **Machine Learning** inference using pre-trained models
- **User authentication** and management
- **Medical document analysis** using Google Gemini AI
- **Database operations** with SQLAlchemy ORM

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.100+
- **Python**: 3.8+
- **ORM**: SQLAlchemy
- **Database**: SQLite (default) / MySQL (configurable)
- **ML Libraries**: 
  - scikit-learn - ML model inference
  - numpy - Numerical computations
  - joblib - Model serialization/deserialization
- **AI Integration**: Google Generative AI (Gemini)
- **PDF Processing**: PyMuPDF (fitz)
- **Authentication**: passlib (bcrypt)
- **Validation**: Pydantic v2
- **Environment**: python-dotenv
- **Server**: Uvicorn (ASGI server)

## 📁 Project Structure

```
Backend/
├── api/                          # API route handlers
│   ├── __init__.py              # Router exports
│   ├── user_router.py           # User authentication endpoints
│   ├── prediction_router.py     # Disease prediction endpoints
│   └── pdf_router.py            # PDF analysis endpoints
│
├── config/                       # Configuration modules
│   ├── __init__.py
│   ├── database.py              # Database connection and session
│   └── settings.py              # Application settings (env vars)
│
├── core/                         # Core business logic
│   ├── __init__.py
│   ├── config.py                # Core configuration
│   └── predictor.py             # Disease prediction logic
│
├── models/                       # Machine Learning models
│   ├── diabetes/
│   │   └── model.pkl
│   ├── Heart/
│   │   └── model.pkl
│   ├── Depression/
│   │   └── model.pkl
│   ├── Stroke/
│   │   └── model.pkl
│   ├── Parkinsons/
│   │   └── model.pkl
│   ├── Thyroid/
│   │   └── model.pkl
│   ├── Hepatits/
│   │   └── model.pkl
│   ├── Kidney/
│   │   └── model.pkl
│   └── user.py                  # User database model
│
├── schemas/                      # Pydantic schemas
│   ├── __init__.py
│   ├── user.py                  # User data schemas
│   └── disease.py               # Disease input schemas
│
├── utils/                        # Utility functions
│   ├── __init__.py
│   ├── predict_utils.py         # ML prediction utilities
│   └── security.py              # Password hashing utilities
│
├── main.py                       # Application entry point
├── requirements.txt              # Python dependencies
├── .env                         # Environment variables (not in git)
└── README.md                    # This file
```

## 📦 Installation

### 1. Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment tool (venv or virtualenv)

### 2. Clone and Setup

```bash
# Navigate to the Backend directory
cd Backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
# Database Configuration
DATABASE_URL=sqlite:///./health_predict.db
# For MySQL: mysql+pymysql://user:password@localhost/health_predict

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL_NAME=gemini-2.0-flash-exp

# JWT Authentication (Optional for future implementation)
SECRET_KEY=your_secret_key_here_use_strong_random_string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Database Setup

The application uses SQLite by default, which requires no additional setup. For MySQL:

1. Install MySQL server
2. Create a database: `CREATE DATABASE health_predict;`
3. Update `DATABASE_URL` in `.env` file
4. Install MySQL connector: `pip install mysql-connector-python`

## 🚀 Running the Application

### Development Server

```bash
# Ensure virtual environment is activated
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### Production Server

```bash
# Run with multiple workers
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Access API Documentation

Once the server is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 📖 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Health Check Endpoints

#### GET `/`
Root endpoint - API status check
```json
{
  "message": "HealthPredict API is running"
}
```

#### GET `/health`
Health check endpoint
```json
{
  "status": "OK",
  "message": "HealthPredict API is healthy"
}
```

### User Management Endpoints

#### POST `/api/v1/signup`
Register a new user

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password123"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully"
}
```

#### POST `/api/v1/login`
Authenticate user and get user details

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secure_password123"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

### Disease Prediction Endpoints

All prediction endpoints follow the same pattern: `POST /api/v1/predict/{disease_name}`

#### POST `/api/v1/predict/diabetes`
Predict diabetes risk

**Request Body:**
```json
{
  "gender": 1,
  "age": 45.0,
  "hypertension": 0,
  "heart_disease": 0,
  "smoking_history": 2,
  "bmi": 27.5,
  "HbA1c_level": 5.7,
  "blood_glucose_level": 110
}
```

**Response (200 OK):**
```json
{
  "disease": "diabetes",
  "prediction": 0,
  "risk_status": "Low Risk"
}
```

#### POST `/api/v1/predict/heart`
Predict heart disease risk

**Request Body:**
```json
{
  "age": 55,
  "gender": 1,
  "chestpain": 2,
  "restingBP": 130,
  "serumcholesterol": 250,
  "fastingbloodsugar": 0,
  "restingrelectro": 1,
  "maxheartrate": 150,
  "exerciseangia": 0,
  "oldpeak": 1.5,
  "slope": 2,
  "noofmajorvessels": 0
}
```

#### POST `/api/v1/predict/depression`
Detect depression risk in students

**Request Body:**
```json
{
  "gender": 0,
  "age": 21.0,
  "city": 1,
  "academic_pressure": 4.0,
  "cgpa": 3.2,
  "study_satisfaction": 3.0,
  "sleep_duration": 6,
  "dietary_habits": 2,
  "suicidal_thoughts": 0,
  "work_study_hours": 8.0,
  "financial_stress": 3.5,
  "family_history_mental_illness": 0,
  "new_degree": 1
}
```

#### POST `/api/v1/predict/stroke`
Predict stroke risk

**Request Body:**
```json
{
  "gender": 1,
  "age": 65.0,
  "hypertension": 1,
  "heart_disease": 0,
  "ever_married": 1,
  "work_type": 2,
  "residence_type": 1,
  "avg_glucose_level": 120.5,
  "bmi": 28.3,
  "smoking_status": 1
}
```

#### POST `/api/v1/predict/parkinsons`
Predict Parkinson's disease risk

**Request Body:** (58 features including age, gender, BMI, blood pressure, cholesterol levels, UPDRS scores, and symptoms)

#### POST `/api/v1/predict/thyroid`
Predict thyroid disorder

**Request Body:** (21 features including age, sex, thyroid hormone levels TSH, T3, T4, T4U, FTI, and medical history)

#### POST `/api/v1/predict/hepatitis`
Predict hepatitis

**Request Body:** (11 features including age, sex, albumin, cholesterol, creatinine, bilirubin, and liver enzyme levels)

#### POST `/api/v1/predict/kidney`
Predict kidney disease

**Request Body:** (24 features including age, blood pressure, blood glucose, blood urea, serum creatinine, hemoglobin, and various clinical indicators)

### AI-Powered Analysis

#### POST `/api/v1/analyze-pdf`
Analyze medical documents using AI

**Request:** Multipart form-data with PDF file

**Response (200 OK):**
```json
{
  "analysis": "Detailed AI-generated analysis of the medical document including diagnoses, medications, risk factors, and recommendations..."
}
```

## 🤖 Disease Prediction Models

### Available Models

| Disease | Model File | Input Features | Description |
|---------|-----------|----------------|-------------|
| Diabetes | `models/diabetes/model.pkl` | 8 features | Predicts diabetes risk based on glucose, BMI, age, etc. |
| Heart Disease | `models/Heart/model.pkl` | 12 features | Cardiovascular risk assessment |
| Depression | `models/Depression/model.pkl` | 13 features | Student depression detection |
| Stroke | `models/Stroke/model.pkl` | 10 features | Stroke risk prediction |
| Parkinson's | `models/Parkinsons/model.pkl` | 58 features | Comprehensive Parkinson's assessment |
| Thyroid | `models/Thyroid/model.pkl` | 21 features | Thyroid disorder detection |
| Hepatitis | `models/Hepatits/model.pkl` | 11 features | Hepatitis prediction |
| Kidney Disease | `models/Kidney/model.pkl` | 24 features | Kidney disease detection |

### Model Loading

Models are loaded dynamically using the `load_model` function:

```python
def load_model(disease_name):
    model_path = f"models/{disease_name}/model.pkl"
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"No model found for {disease_name}")
    model = joblib.load(model_path)
    return model
```

### Prediction Flow

1. **Input Validation**: Pydantic schemas validate incoming data
2. **Model Loading**: Appropriate model is loaded from disk
3. **Feature Extraction**: Input data is converted to feature array
4. **Prediction**: Model makes binary prediction (0 or 1)
5. **Risk Assessment**: Result is categorized as "Low Risk" or "High Risk"
6. **Response**: JSON response with prediction and risk status

### Adding New Models

To add a new disease prediction model:

1. Create a new directory in `models/`: `models/NewDisease/`
2. Save trained model as: `models/NewDisease/model.pkl`
3. Create Pydantic schema in `schemas/disease.py`:
   ```python
   class NewDiseaseInput(BaseModel):
       feature1: float
       feature2: int
       # ... additional features
   ```
4. Register in `api/prediction_router.py`:
   ```python
   disease_models = {
       # ... existing models
       "newdisease": NewDiseaseInput,
   }
   ```

## 🗄️ Database Schema

### User Table

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL
);
```

**SQLAlchemy Model:**
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
```

## 🔧 Development

### Code Structure Best Practices

- **Separation of Concerns**: API routes, business logic, and data models are separated
- **Dependency Injection**: FastAPI's dependency injection for database sessions
- **Type Safety**: Pydantic schemas for request/response validation
- **Error Handling**: Custom HTTP exceptions with meaningful messages

### Testing

```bash
# Install testing dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Code Style

```bash
# Install development tools
pip install black flake8 mypy

# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

### Adding New API Endpoints

1. Create route handler in appropriate router file
2. Define Pydantic schemas for request/response
3. Implement business logic in `core/` module
4. Add route to FastAPI app in `main.py`

## 🔒 Security Features

- **Password Hashing**: bcrypt via passlib
- **SQL Injection Prevention**: SQLAlchemy ORM parameterized queries
- **Input Validation**: Pydantic schema validation
- **CORS Protection**: Configured for specific origins
- **Environment Variables**: Sensitive data in `.env` file

## 🐛 Common Issues & Troubleshooting

### Model Loading Errors
```
FileNotFoundError: No model found for {disease_name}
```
**Solution**: Ensure model files exist in `models/{disease_name}/model.pkl`

### Database Connection Issues
```
sqlalchemy.exc.OperationalError: unable to open database file
```
**Solution**: Check file permissions and DATABASE_URL in `.env`

### Import Errors
```
ModuleNotFoundError: No module named 'fastapi'
```
**Solution**: Activate virtual environment and reinstall requirements

## 📊 Performance Considerations

- **Model Caching**: Models are loaded once per disease type
- **Database Connection Pooling**: SQLAlchemy manages connection pool
- **Async Operations**: FastAPI's async support for concurrent requests
- **Response Compression**: Consider enabling for large responses

## 🚀 Deployment

### Using Uvicorn

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Gunicorn + Uvicorn Workers

```bash
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📝 Dependencies

See `requirements.txt` for complete list:

```
fastapi                    # Web framework
sqlalchemy                 # ORM
python-dotenv             # Environment variables
pydantic[email]           # Data validation
pydantic-settings         # Settings management
pymupdf                   # PDF processing
google-generativeai       # Gemini AI
pickle-mixin              # Model serialization
numpy                     # Numerical operations
joblib                    # Model loading
passlib                   # Password hashing
scikit-learn              # ML inference
mysql-connector-python    # MySQL driver
python-multipart          # File upload support
uvicorn[standard]         # ASGI server
```

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the [main README](../README.md) for general information
- Review FastAPI documentation: https://fastapi.tiangolo.com/

---

**Note**: This backend is designed for educational purposes. For production use, implement additional security measures, monitoring, and testing.
