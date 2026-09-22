import os
import random
from datetime import date, timedelta

import numpy as np
import pandas as pd


# -----------------------------
# Configuration
# -----------------------------

START_DATE = date(2025, 4, 1)
END_DATE = date(2026, 3, 31)

OUTPUT_DIR = os.path.join("ml", "data", "raw")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "inventory_data.csv")

INGREDIENTS = {
    "Rice": {
        "base_consumption": 210,
        "stock_capacity": 600,
        "minimum_stock": 100,
    },
    "Dal": {
        "base_consumption": 65,
        "stock_capacity": 200,
        "minimum_stock": 35,
    },
    "Wheat": {
        "base_consumption": 120,
        "stock_capacity": 350,
        "minimum_stock": 60,
    },
    "Oil": {
        "base_consumption": 25,
        "stock_capacity": 80,
        "minimum_stock": 15,
    },
}


# -----------------------------
# Random seed
# -----------------------------

random.seed(42)
np.random.seed(42)


# -----------------------------
# Generate dates
# -----------------------------

dates = []

current_date = START_DATE

while current_date <= END_DATE:
    dates.append(current_date)
    current_date += timedelta(days=1)


# -----------------------------
# Generate school/student data
# -----------------------------

records = []

students_base = 450

# Keep track of stock for every ingredient
current_stock = {
    ingredient: config["stock_capacity"] * 0.7
    for ingredient, config in INGREDIENTS.items()
}


for current_date in dates:

    day_name = current_date.strftime("%A")
    month = current_date.month

    # Weekend
    weekend = current_date.weekday() >= 5

    # Approximate school holidays for synthetic data
    holiday = 0

    # Summer break
    if current_date.month in [5, 6]:
        holiday = 1

    # Winter break
    if current_date.month == 12 and current_date.day >= 25:
        holiday = 1

    # New year holiday
    if current_date.month == 1 and current_date.day <= 5:
        holiday = 1

    # Students present
    if holiday or weekend:
        students_present = 0
        meals_served = 0
    else:
        students_present = int(
            np.clip(
                np.random.normal(students_base, 25),
                300,
                550,
            )
        )

        meals_served = students_present

    for ingredient, config in INGREDIENTS.items():

        opening_stock = current_stock[ingredient]

        # Consumption based on students
        if meals_served > 0:

            student_factor = meals_served / students_base

            base_consumption = (
                config["base_consumption"] * student_factor
            )

            # Weekday variation
            weekday_factor = np.random.uniform(0.95, 1.05)

            # Small random variation
            random_factor = np.random.uniform(0.95, 1.05)

            consumption = (
                base_consumption
                * weekday_factor
                * random_factor
            )

            # Add occasional abnormal consumption
            if random.random() < 0.02:
                consumption *= random.uniform(1.4, 2.0)

            consumption = round(max(consumption, 0), 2)

        else:
            consumption = 0.0

        # -----------------------------
        # Refill stock when necessary
        # -----------------------------

        received_quantity = 0.0

        predicted_closing = opening_stock - consumption

        if predicted_closing < config["minimum_stock"]:

            refill_amount = (
                config["stock_capacity"]
                - predicted_closing
            )

            received_quantity = round(
                max(refill_amount, 0),
                2,
            )

        # Closing stock
        closing_stock = (
            opening_stock
            + received_quantity
            - consumption
        )

        closing_stock = round(
            max(closing_stock, 0),
            2,
        )

        # Save record
        records.append(
            {
                "date": current_date.isoformat(),
                "ingredient": ingredient,
                "students_present": students_present,
                "meals_served": meals_served,
                "opening_stock": round(opening_stock, 2),
                "received_quantity": received_quantity,
                "closing_stock": closing_stock,
                "consumption": consumption,
                "day_of_week": day_name,
                "month": month,
                "holiday": holiday,
                "current_stock": closing_stock,
                "minimum_stock": config["minimum_stock"],
            }
        )

        # Update stock
        current_stock[ingredient] = closing_stock


# -----------------------------
# Create DataFrame
# -----------------------------

df = pd.DataFrame(records)


# -----------------------------
# Create output directory
# -----------------------------

os.makedirs(OUTPUT_DIR, exist_ok=True)


# -----------------------------
# Save dataset
# -----------------------------

df.to_csv(
    OUTPUT_FILE,
    index=False,
)


# -----------------------------
# Print information
# -----------------------------

print("=" * 50)
print("Synthetic inventory dataset created successfully!")
print("=" * 50)

print(f"File: {OUTPUT_FILE}")
print(f"Rows: {len(df)}")
print(f"Columns: {len(df.columns)}")

print("\nIngredients:")
print(df["ingredient"].value_counts())

print("\nDate range:")
print(df["date"].min(), "to", df["date"].max())

print("\nDataset preview:")
print(df.head())

print("\nMissing values:")
print(df.isnull().sum())