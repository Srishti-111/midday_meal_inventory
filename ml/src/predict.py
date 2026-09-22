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
    "demand_forecasting_model.joblib"
)


# -----------------------------------------
# Load trained forecasting model
# -----------------------------------------

model_package = joblib.load(MODEL_PATH)

model = model_package["model"]
preprocessor = model_package["preprocessor"]
features = model_package["features"]


# -----------------------------------------
# Demand Prediction Function
# -----------------------------------------

def predict_demand(
    ingredient,
    students_present,
    meals_served,
    previous_day_consumption,
    rolling_7_day_consumption,
    day_of_week_num,
    month_num,
    holiday,
    current_stock,
    received_quantity
):
    """
    Predict next-day consumption for an ingredient.
    """

    input_data = pd.DataFrame([
        {
            "ingredient": ingredient,
            "students_present": students_present,
            "meals_served": meals_served,
            "previous_day_consumption": previous_day_consumption,
            "rolling_7_day_consumption": rolling_7_day_consumption,
            "day_of_week_num": day_of_week_num,
            "month_num": month_num,
            "holiday": holiday,
            "current_stock": current_stock,
            "received_quantity": received_quantity
        }
    ])

    input_data = input_data[features]

    encoded_data = preprocessor.transform(input_data)

    prediction = model.predict(encoded_data)[0]

    return round(float(prediction), 2)


# -----------------------------------------
# Test prediction
# -----------------------------------------

if __name__ == "__main__":

    prediction = predict_demand(
        ingredient="Rice",
        students_present=450,
        meals_served=450,
        previous_day_consumption=200,
        rolling_7_day_consumption=205,
        day_of_week_num=2,
        month_num=4,
        holiday=0,
        current_stock=300,
        received_quantity=0
    )

    print("-----------------------------------------")
    print("Demand Forecast Test")
    print("-----------------------------------------")
    print(f"Predicted Rice consumption: {prediction}")