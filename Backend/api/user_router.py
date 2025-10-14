from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from config.database import get_db
from models.user import User
from utils.security import hash_password, verify_password
from schemas.user import UserCreate, UserLogin, UserResponse

user_router = APIRouter()

# User signup
@user_router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=dict)
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
@user_router.post("/login", response_model=UserResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email
    )