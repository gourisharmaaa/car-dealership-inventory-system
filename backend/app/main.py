"""FastAPI application entrypoint."""
from fastapi import FastAPI

from app.routers import auth
from app.routers.vehicles import router as vehicles_router

app = FastAPI(title="Car Dealership Inventory API")

app.include_router(auth.router)
app.include_router(vehicles_router)