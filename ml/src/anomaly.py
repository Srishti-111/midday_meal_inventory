import os
import joblib
import pandas as pd


# -----------------------------------------
# File paths
# -----------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "anomaly_detection_model.joblib"
)


# -----------------------------------------
# Load trained anomaly detection model
# -----------------------------------------

anomaly_model = joblib.load(MODEL_PATH)


# -----------------------------------------
# Anomaly Detection Function
# -----------------------------------------

def detect_anomaly(
    ingredient,
    students_present,
    meals_served,
    consumption,
    previous_day_consumption,
    rolling_7_day_consumption
):
    """
    Detect whether an inventory consumption record
    is normal or anomalous.
    """

    input_data = pd.DataFrame([
        {
            "ingredient": ingredient,
            "students_present": students_present,
            "meals_served": meals_served,
            "consumption": consumption,
            "previous_day_consumption": previous_day_consumption,
            "rolling_7_day_consumption": rolling_7_day_consumption
        }
    ])

    # Use the same encoding method used during training
    input_encoded = pd.get_dummies(
        input_data,
        columns=["ingredient"],
        dtype=int
    )

    # Get the feature columns expected by the trained model
    if hasattr(anomaly_model, "feature_names_in_"):
        expected_features = anomaly_model.feature_names_in_

        input_encoded = input_encoded.reindex(
            columns=expected_features,
            fill_value=0
        )

    prediction = anomaly_model.predict(input_encoded)[0]

    anomaly_score = anomaly_model.decision_function(
        input_encoded
    )[0]

    if prediction == -1:
        status = "Anomaly"
    else:
        status = "Normal"

    return {
        "status": status,
        "anomaly_score": round(float(anomaly_score), 4)
    }


# -----------------------------------------
# Test anomaly detection
# -----------------------------------------

if __name__ == "__main__":

    result = detect_anomaly(
        ingredient="Rice",
        students_present=450,
        meals_served=450,
        consumption=220,
        previous_day_consumption=200,
        rolling_7_day_consumption=205
    )

    print("-----------------------------------------")
    print("Anomaly Detection Test")
    print("-----------------------------------------")
    print(f"Status: {result['status']}")
    print(f"Anomaly Score: {result['anomaly_score']}")