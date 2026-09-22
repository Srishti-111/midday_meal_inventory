from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine
from models import SensorReading as SensorReadingModel

app = FastAPI()


class SensorReading(BaseModel):
    device_id: str
    ingredient: str
    weight: float


@app.get("/")
def root():
    return {
        "message": "Mid-Day Meal Inventory Backend is running"
    }


@app.post("/api/sensors/readings")
def receive_sensor_reading(data: SensorReading):

    db = Session(engine)

    reading = SensorReadingModel(
        device_id=data.device_id,
        ingredient=data.ingredient,
        weight=data.weight
    )

    db.add(reading)
    db.commit()
    db.refresh(reading)
    db.close()

    return {
        "success": True,
        "message": "Sensor data saved successfully",
        "data": {
            "id": reading.id,
            "device_id": reading.device_id,
            "ingredient": reading.ingredient,
            "weight": reading.weight
        }
    }