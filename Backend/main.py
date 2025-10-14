from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import user_router, prediction_router, pdf_router
from config.database import engine, Base

# Initialize tables
Base.metadata.create_all(bind=engine)

# Initialize app
app = FastAPI(
    title="HealthPredict - AI-Powered Health Prediction API",
    description="Advanced health prediction tools for diabetes, heart disease, and student depression detection",
    version="1.0.0"
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(user_router, prefix="/api/v1", tags=["users"])
app.include_router(prediction_router, prefix="/api/v1", tags=["predictions"])
app.include_router(pdf_router, prefix="/api/v1", tags=["pdf-analysis"])

# Health check
@app.get("/")
def root():
    return {"message": "HealthPredict API is running"}

@app.get("/health")
def health_check():
    return {"status": "OK", "message": "HealthPredict API is healthy"}