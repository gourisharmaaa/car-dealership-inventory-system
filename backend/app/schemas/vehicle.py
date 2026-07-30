"""Pydantic schemas for vehicle payloads and responses."""
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class VehicleBase(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None


class VehicleResponse(VehicleBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)
