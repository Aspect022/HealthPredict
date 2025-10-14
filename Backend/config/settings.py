from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./health_predict.db")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "AIzaSyBHDQsHUazLBmYpqE28VZGS7LREHlenJ5o")
    gemini_model_name: str = os.getenv("GEMINI_MODEL_NAME", "gemini-2.0-flash-exp")
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    class Config:
        env_file = ".env"

settings = Settings()