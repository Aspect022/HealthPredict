from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time
from database import SessionLocal, engine
from models import Base, User
from utils import hash_password, verify_password
from auth import get_db
from schemas import (
    DiabetesInput, StrokeInput, ParkinsonsInput, ThyroidInput,
    DepressionInput, HepatitisInput, HeartInput, KidneyInput
)
from predictor import DiseasePredictor
from config import settings

# External libs
import fitz
import google.generativeai as genai

# Initialize tables
Base.metadata.create_all(bind=engine)

# Initialize app
app = FastAPI(title="FastAPI Application")
logger = logging.getLogger("healthpredict")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
metrics = {
    "prediction_requests_total": 0,
    "prediction_failures_total": 0,
    "pdf_analysis_requests_total": 0,
    "pdf_analysis_failures_total": 0,
}

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.allowed_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI
model = None
if settings.gemini_api_key:
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(model_name=settings.gemini_model_name)
else:
    logger.warning("GEMINI_API_KEY not configured; /analyze-pdf will be unavailable.")

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

# User signup
@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User created successfully"}

# User login
@app.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return {"username": user.username, "email": user.email, "id": user.id}

# Disease prediction routing
disease_models = {
    "diabetes": DiabetesInput,
    "stroke": StrokeInput,
    "parkinsons": ParkinsonsInput,
    "thyroid": ThyroidInput,
    "depression": DepressionInput,
    "hepatitis": HepatitisInput,
    "heart": HeartInput,
    "kidney": KidneyInput,
}

@app.post("/predict/{disease_name}")
async def predict_disease(disease_name: str, input_data: dict):
    started_at = time.perf_counter()
    metrics["prediction_requests_total"] += 1
    if disease_name not in disease_models:
        raise HTTPException(status_code=404, detail="Disease model not found")
    try:
        model_instance = disease_models[disease_name](**input_data)
        predictor = DiseasePredictor(disease_name, type(model_instance))
        response = predictor.predict(model_instance)
        elapsed_ms = round((time.perf_counter() - started_at) * 1000, 2)
        logger.info("prediction_success disease=%s latency_ms=%s", disease_name, elapsed_ms)
        return response
    except Exception as e:
        metrics["prediction_failures_total"] += 1
        logger.exception("prediction_failure disease=%s error=%s", disease_name, str(e))
        raise HTTPException(status_code=400, detail=f"Invalid input data: {e}")

# PDF AI analysis endpoint
@app.post("/analyze-pdf")
async def analyze_pdf(file: UploadFile = File(...)):
    metrics["pdf_analysis_requests_total"] += 1
    try:
        if not model:
            raise HTTPException(status_code=503, detail="Gemini is not configured.")
        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        text = "".join(page.get_text() for page in doc)

        prompt = (
            "You are a medical expert AI. Analyze the following medical document in depth. "
            "Extract diagnoses, medications, possible conditions, patient history, future risk factors, "
            "suggested tests, and anything useful from a doctor’s perspective.\n\n"
            f"Medical Document:\n{text}"
        )
        response = model.generate_content(prompt)
        return {"analysis": response.text}

    except Exception as e:
        metrics["pdf_analysis_failures_total"] += 1
        logger.exception("pdf_analysis_failure error=%s", str(e))
        return JSONResponse(status_code=500, content={"detail": f"PDF analysis failed: {str(e)}"})

# Health check
@app.get("/")
def root():
    return {"message": "FastAPI is running", "environment": settings.app_env}


@app.get("/health/ready")
def readiness():
    return {
        "status": "ready",
        "gemini_configured": bool(settings.gemini_api_key),
        "environment": settings.app_env,
    }


@app.get("/metrics")
def get_metrics():
    return metrics

# Uvicorn entry
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)