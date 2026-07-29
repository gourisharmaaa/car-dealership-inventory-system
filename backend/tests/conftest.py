"""
Shared pytest fixtures for the test suite.

Provides:
- A test database session (separate Postgres DB, not in-memory)
- A FastAPI TestClient with the DB dependency overridden
- Automatic table creation/teardown per test for isolation
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

TEST_DATABASE_URL = "postgresql://dealership:dealership_pass@localhost:5432/dealership_test_db"

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """
    Provides a clean database session for each test function.
    Creates all tables before the test, drops them after —
    ensures tests don't leak state into one another.
    """
    from app.core.database import Base 
    from app.models.user import User # noqa: local import to avoid circular imports
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """
    Provides a FastAPI TestClient with the real DB dependency
    swapped out for our test session.
    """
    from app.main import app
    from app.core.database import get_db

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()