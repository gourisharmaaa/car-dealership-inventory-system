"""Pydantic schema for the JWT response returned on login."""
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"