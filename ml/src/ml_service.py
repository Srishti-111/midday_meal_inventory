import pandas as pd

from predict import predict_demand
from anomaly import detect_anomaly


# -----------------------------------------
# Combined ML Service
# -----------------------------------------

def run_ml_prediction(
    ingredient,
    students_present,
    meals_served,
    previous_day_consumption,
    rolling_7_day_consumption,
    day_of_week_num,
    month_num,
    holiday,
    current_stock,
    received_quantity,
    consumption
):
    """
    Run both demand forecasting and anomaly detection.
    """

    # -----------------------------------------
    # 1. Demand Forecast
    # -----------------------------------------

    predicted_demand = predict_demand(
        ingredient=ingredient,
        students_present=students_present,
        meals_served=meals_served,
        previous_day_consumption=previous_day_consumption,
        rolling_7_day_consumption=rolling_7_day_consumption,
        day_of_week_num=day_of_week_num,
        month_num=month_num,
        holiday=holiday,
        current_stock=current_stock,
        received_quantity=received_quantity
    )

    # -----------------------------------------
    # 2. Anomaly Detection
    # -----------------------------------------

    anomaly_result = detect_anomaly(
        ingredient=ingredient,
        students_present=students_present,
        meals_served=meals_served,
        consumption=consumption,
        previous_day_consumption=previous_day_consumption,
        rolling_7_day_consumption=rolling_7_day_consumption
    )

    # -----------------------------------------
    # 3. Stockout Estimation
    # -----------------------------------------

    if predicted_demand > 0:
        estimated_days_remaining = (
            current_stock / predicted_demand
        )
    else:
        estimated_days_remaining = float("inf")

    if estimated_days_remaining <= 1:
        stockout_status = "Critical"
    elif estimated_days_remaining <= 3:
        stockout_status = "Warning"
    else:
        stockout_status = "Normal"

    # -----------------------------------------
    # 4. Smart Reorder Recommendation
    # -----------------------------------------

    safety_stock_days = 2

    safety_stock = (
        predicted_demand * safety_stock_days
    )

    seven_day_requirement = (
        predicted_demand * 7
    )

    recommended_purchase = (
        seven_day_requirement
        + safety_stock
        - current_stock
    )

    recommended_purchase = max(
        recommended_purchase,
        0
    )

    # -----------------------------------------
    # 5. Return Complete ML Result
    # -----------------------------------------

    return {
        "ingredient": ingredient,
        "predicted_demand": round(
            predicted_demand,
            2
        ),
        "anomaly_status": anomaly_result["status"],
        "anomaly_score": anomaly_result["anomaly_score"],
        "estimated_days_remaining": round(
            estimated_days_remaining,
            2
        ),
        "stockout_status": stockout_status,
        "safety_stock": round(
            safety_stock,
            2
        ),
        "seven_day_requirement": round(
            seven_day_requirement,
            2
        ),
        "recommended_purchase": round(
            recommended_purchase,
            2
        )
    }


# -----------------------------------------
# Test Complete ML Service
# -----------------------------------------

if __name__ == "__main__":

    result = run_ml_prediction(
        ingredient="Rice",
        students_present=450,
        meals_served=450,
        previous_day_consumption=200,
        rolling_7_day_consumption=205,
        day_of_week_num=2,
        month_num=4,
        holiday=0,
        current_stock=300,
        received_quantity=0,
        consumption=210
    )

    print("-----------------------------------------")
    print("Complete ML Service Test")
    print("-----------------------------------------")

    for key, value in result.items():
        print(f"{key}: {value}")