from fastapi import FastAPI
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import engine
from models import SensorReading as SensorReadingModel, InventoryItem

app = FastAPI()


class SensorReading(BaseModel):
    device_id: str
    ingredient: str
    weight: float

class InventoryItemCreate(BaseModel):
    ingredient: str
    current_stock: float
    minimum_stock: float
    unit: str = "kg"


@app.get("/")
def root():
    return {
        "message": "Mid-Day Meal Inventory Backend is running"
    }

# get sensor readings endpoint
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

# create inventory list in database (data recieved from hardware)
@app.post("/api/inventory")
def create_inventory_item(data: InventoryItemCreate):

    db = Session(engine)

    item = InventoryItem(
        ingredient=data.ingredient,
        current_stock=data.current_stock,
        minimum_stock=data.minimum_stock,
        unit=data.unit
    )

    db.add(item)
    db.commit()
    db.refresh(item)
    db.close()

    return {
        "success": True,
        "message": "Inventory item created successfully",
        "data": {
            "id": item.id,
            "ingredient": item.ingredient,
            "current_stock": item.current_stock,
            "minimum_stock": item.minimum_stock,
            "unit": item.unit
        }
    }

# fetch inventory details from dashboard endpoint
@app.get("/api/inventory")
def get_inventory():

    db = Session(engine)

    items = db.query(InventoryItem).all()
    db.close()

    return {
        "success": True,
        "data": [
            {
                "id": item.id,
                "ingredient": item.ingredient,
                "current_stock": item.current_stock,
                "minimum_stock": item.minimum_stock,
                "unit": item.unit
            }
            for item in items
        ]
    }

# endpoint to delete an inventory item
@app.delete("/api/inventory/{item_id}")
def delete_inventory_item(item_id: int):

    db = Session(engine)

    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()

    if not item:
        db.close()
        return {
            "success": False,
            "message": "Inventory item not found"
        }

    db.delete(item)
    db.commit()
    db.close()

    return {
        "success": True,
        "message": "Inventory item deleted successfully",
        "id": item_id
    }

# stock update endpoint
@app.put("/api/inventory/{item_id}")
def update_inventory(item_id: int, data: InventoryItemCreate):

    db = Session(engine)

    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()

    if not item:
        db.close()
        return {
            "success": False,
            "message": "Inventory item not found"
        }

    item.ingredient = data.ingredient
    item.current_stock = data.current_stock
    item.minimum_stock = data.minimum_stock
    item.unit = data.unit

    db.commit()
    db.refresh(item)
    db.close()

    return {
        "success": True,
        "message": "Inventory item updated successfully",
        "data": {
            "id": item.id,
            "ingredient": item.ingredient,
            "current_stock": item.current_stock,
            "minimum_stock": item.minimum_stock,
            "unit": item.unit
        }
    }