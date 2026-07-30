"""Business logic for vehicle operations."""
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


def create_vehicle(db: Session, vehicle_data: VehicleCreate) -> Vehicle:
    vehicle = Vehicle(
        make=vehicle_data.make,
        model=vehicle_data.model,
        category=vehicle_data.category,
        price=vehicle_data.price,
        quantity=vehicle_data.quantity,
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def list_vehicles(db: Session) -> List[Vehicle]:
    return db.query(Vehicle).all()


def get_vehicle(db: Session, vehicle_id: str) -> Optional[Vehicle]:
    return db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()


def search_vehicles(
    db: Session,
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
) -> List[Vehicle]:
    query = db.query(Vehicle)
    if make:
        query = query.filter(Vehicle.make.ilike(f"%{make}%"))
    if model:
        query = query.filter(Vehicle.model.ilike(f"%{model}%"))
    if category:
        query = query.filter(Vehicle.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)
    return query.all()


def update_vehicle(db: Session, vehicle: Vehicle, updates: VehicleUpdate) -> Vehicle:
    for field, value in updates.model_dump().items():
        if value is not None:
            setattr(vehicle, field, value)
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def delete_vehicle(db: Session, vehicle: Vehicle) -> None:
    db.delete(vehicle)
    db.commit()


def purchase_vehicle(db: Session, vehicle: Vehicle, quantity: int = 1) -> Vehicle:
    if quantity <= 0:
        raise ValueError("Purchase quantity must be positive")
    if vehicle.quantity < quantity:
        raise ValueError("Not enough stock to complete purchase")
    vehicle.quantity -= quantity
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


def restock_vehicle(db: Session, vehicle: Vehicle, quantity: int = 1) -> Vehicle:
    if quantity <= 0:
        raise ValueError("Restock quantity must be positive")
    vehicle.quantity += quantity
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle
