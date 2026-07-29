"""FastAPI application entrypoint."""
from fastapi import FastAPI

from app.routers import auth

app = FastAPI(title="Car Dealership Inventory API")

app.include_router(auth.router)