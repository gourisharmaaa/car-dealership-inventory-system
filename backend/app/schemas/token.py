"""Pydantic schema for the JWT response returned on login."""
from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    email: EmailStr