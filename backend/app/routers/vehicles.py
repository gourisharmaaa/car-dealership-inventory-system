"""Vehicle routes for inventory management."""
from typing import List, Optional
from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_admin_user, get_current_user
from app.core.database import get_db
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleResponse,
    VehicleUpdate,
)
from app.services.vehicle_service import (
    create_vehicle,
    delete_vehicle,
    get_vehicle,
    list_vehicles,
    purchase_vehicle,
    restock_vehicle,
    search_vehicles,
    update_vehicle,
)


router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])


@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def add_vehicle(
    vehicle_data: VehicleCreate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin_user),
) -> VehicleResponse:
    return create_vehicle(db, vehicle_data)


@router.get("", response_model=List[VehicleResponse])
def get_vehicles(
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
) -> List[VehicleResponse]:
    return list_vehicles(db)


@router.get("/search", response_model=List[VehicleResponse])
def search(
    make: Optional[str] = None,
    model: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
) -> List[VehicleResponse]:
    return search_vehicles(db, make, model, category, min_price, max_price)


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update(
    vehicle_id: str,
    updates: VehicleUpdate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin_user),
) -> VehicleResponse:
    vehicle = get_vehicle(db, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    return update_vehicle(db, vehicle, updates)


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove(
    vehicle_id: str,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin_user),
) -> None:
    vehicle = get_vehicle(db, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    delete_vehicle(db, vehicle)


@router.post("/{vehicle_id}/purchase", response_model=VehicleResponse)
def purchase(
    vehicle_id: str,
    quantity: int = Body(1, gt=0, embed=True),
    db: Session = Depends(get_db),
    _: object = Depends(get_current_user),
) -> VehicleResponse:
    vehicle = get_vehicle(db, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    try:
        return purchase_vehicle(db, vehicle, quantity)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.post("/{vehicle_id}/restock", response_model=VehicleResponse)
def restock(
    vehicle_id: str,
    quantity: int = Body(..., gt=0, embed=True),
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin_user),
) -> VehicleResponse:
    vehicle = get_vehicle(db, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")
    try:
        return restock_vehicle(db, vehicle, quantity)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
