# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from database import SessionLocal, engine
from models import Base, User
from utils import hash_password, verify_password
from auth import get_db
from schemas import DiabetesInput,StrokeInput,ParkinsonsInput,ThyroidInput,DepressionInput,HepatitisInput,HeartInput,KidneyInput  # Import additional models as needed
from predictor import DiseasePredictor

# Create tables in the database
Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
app = FastAPI(title="FastAPI Application")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic models for request validation
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
        from_attributes = True  # instead of orm_mode = True

# Routes
@app.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if email already exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password)
    )
    
    # Add to database
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {"message": "User created successfully"}

@app.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate a user and return user info."""
    # Find user by email
    user = db.query(User).filter(User.email == user_data.email).first()
    
    # Check credentials
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Return user info
    return {
        "username": user.username,
        "email": user.email,
        "id": user.id
    }

# Mapping of disease names to their input models
disease_models = {
    "diabetes": DiabetesInput,
    "stroke": StrokeInput,
    "parkinsons": ParkinsonsInput,
    "thyroid": ThyroidInput,
    "depression": DepressionInput,
    "hepatitis": HepatitisInput,
    "heart": HeartInput,
    "kidney": KidneyInput
}


@app.post("/predict/{disease_name}")
async def predict_disease(disease_name: str, input_data: dict):
    if disease_name not in disease_models:
        raise HTTPException(status_code=404, detail="Disease model not found")
    
    input_model = disease_models[disease_name]
    try:
        # Convert dict to your input model
        model_instance = input_model(**input_data)
        predictor = DiseasePredictor(disease_name, input_model)
        return predictor.predict(model_instance)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid input data: {str(e)}")

# API health check endpoint
@app.get("/")
def root():
    return {"message": "FastAPI is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
