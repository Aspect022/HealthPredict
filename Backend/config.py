import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    app_env: str = os.getenv("APP_ENV", "development")
    database_url: str = os.getenv("DATABASE_URL", "mysql+mysqlconnector://user:password@localhost/your_db")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model_name: str = os.getenv("GEMINI_MODEL_NAME", "models/gemini-1.5-flash-latest")
    allowed_origins: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    model_base_dir: Path = Path(os.getenv("MODEL_BASE_DIR", "models"))
    model_manifest_path: Path = Path(os.getenv("MODEL_MANIFEST_PATH", "models/manifest.json"))


settings = Settings()
