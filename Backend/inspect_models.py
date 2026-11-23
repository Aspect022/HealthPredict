import os
import joblib

models_dir = r"d:\Development\Big Projects\HealthCare\HealthPredict\Backend\models"
for dirname in os.listdir(models_dir):
    dir_path = os.path.join(models_dir, dirname)
    if os.path.isdir(dir_path):
        model_path = os.path.join(dir_path, "model.pkl")
        if os.path.exists(model_path):
            try:
                model = joblib.load(model_path)
                print(f"--- Model: {dirname} ---")
                print(type(model))
                if hasattr(model, 'get_params'):
                    params = model.get_params()
                    print("Parameters:")
                    # just print a few key ones or all
                    for k, v in list(params.items())[:5]:
                        print(f"  {k}: {v}")
                if hasattr(model, 'classes_'):
                    print(f"Classes: {model.classes_}")
                if hasattr(model, 'feature_importances_'):
                    print("Has feature importances")
                print()
            except Exception as e:
                print(f"Error loading {dirname}: {e}")
