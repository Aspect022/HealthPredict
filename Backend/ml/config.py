from dataclasses import dataclass
from pathlib import Path
import os


@dataclass(frozen=True)
class MLOpsConfig:
    project_root: Path = Path(__file__).resolve().parents[2]
    data_path: Path = Path(os.getenv("DIABETES_DATA_PATH", "ml/data/diabetes.csv"))
    reports_dir: Path = Path("ml/reports")
    model_output_path: Path = Path("models/diabetes/model.pkl")
    mlflow_tracking_uri: str = os.getenv("MLFLOW_TRACKING_URI", "file:./mlruns")
    mlflow_experiment: str = os.getenv("MLFLOW_EXPERIMENT", "healthpredict-diabetes")
    random_state: int = int(os.getenv("TRAIN_RANDOM_STATE", "42"))
    test_size: float = float(os.getenv("TRAIN_TEST_SIZE", "0.2"))

    def abs_path(self, relative: Path) -> Path:
        return self.project_root / relative


config = MLOpsConfig()
