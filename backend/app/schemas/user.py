"""Pydantic schemas for user registration request/response."""
from uuid import UUID
from pydantic import BaseModel, EmailStr, ConfigDict


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "customer"


class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    role: str

    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str