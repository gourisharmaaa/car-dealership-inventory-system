"""
Tests for user registration endpoint: POST /api/auth/register

TDD note: these tests are written BEFORE the endpoint exists.
Running them now should FAIL (Red) because app.main / the route
don't exist yet. That failure is expected and correct.
"""


def test_register_user_success(client):
    """A new user can register with valid email, password, and role."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "jane@example.com",
            "password": "SecurePass123!",
            "role": "customer",
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "jane@example.com"
    assert data["role"] == "customer"
    assert "id" in data
    assert "password" not in data  # never leak password back


def test_register_defaults_to_customer_role(client):
    """If no role is provided, user should default to 'customer'."""
    response = client.post(
        "/api/auth/register",
        json={"email": "noRole@example.com", "password": "SecurePass123!"},
    )

    assert response.status_code == 201
    assert response.json()["role"] == "customer"


def test_register_duplicate_email_fails(client):
    """Registering with an already-used email should fail with 400."""
    client.post(
        "/api/auth/register",
        json={"email": "dupe@example.com", "password": "SecurePass123!"},
    )

    response = client.post(
        "/api/auth/register",
        json={"email": "dupe@example.com", "password": "AnotherPass456!"},
    )

    assert response.status_code == 400
    assert "already" in response.json()["detail"].lower()


def test_register_invalid_email_fails(client):
    """Registering with a malformed email should fail validation (422)."""
    response = client.post(
        "/api/auth/register",
        json={"email": "not-an-email", "password": "SecurePass123!"},
    )

    assert response.status_code == 422

def test_login_success(client):
    """A registered user can log in with correct credentials and gets a JWT."""
    client.post(
        "/api/auth/register",
        json={"email": "login@example.com", "password": "SecurePass123!"},
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "SecurePass123!"},
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password_fails(client):
    """Logging in with an incorrect password should fail with 401."""
    client.post(
        "/api/auth/register",
        json={"email": "wrongpass@example.com", "password": "SecurePass123!"},
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "wrongpass@example.com", "password": "WrongPassword!"},
    )

    assert response.status_code == 401


def test_login_nonexistent_user_fails(client):
    """Logging in with an email that was never registered should fail with 401."""
    response = client.post(
        "/api/auth/login",
        json={"email": "ghost@example.com", "password": "SomePassword123!"},
    )

    assert response.status_code == 401