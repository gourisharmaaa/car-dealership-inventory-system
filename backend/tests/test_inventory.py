"""Tests for vehicle purchase and restock inventory actions."""


def _auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _register_and_login(client, email: str, password: str, role: str = "customer") -> str:
    client.post(
        "/api/auth/register",
        json={"email": email, "password": password, "role": role},
    )
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    return response.json()["access_token"]


def test_purchase_vehicle_reduces_stock(client):
    admin_token = _register_and_login(client, "admin5@example.com", "AdminPass123!", role="admin")
    user_token = _register_and_login(client, "customer5@example.com", "CustomerPass123!")

    response = client.post(
        "/api/vehicles",
        headers=_auth_headers(admin_token),
        json={
            "make": "BMW",
            "model": "M3",
            "category": "Sedan",
            "price": 65999.0,
            "quantity": 2,
        },
    )
    vehicle_id = response.json()["id"]

    purchase_response = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        headers=_auth_headers(user_token),
        json={"quantity": 1},
    )

    assert purchase_response.status_code == 200
    assert purchase_response.json()["quantity"] == 1


def test_purchase_vehicle_without_stock_fails(client):
    admin_token = _register_and_login(client, "admin6@example.com", "AdminPass123!", role="admin")
    user_token = _register_and_login(client, "customer6@example.com", "CustomerPass123!")

    response = client.post(
        "/api/vehicles",
        headers=_auth_headers(admin_token),
        json={
            "make": "Audi",
            "model": "A4",
            "category": "Sedan",
            "price": 39999.0,
            "quantity": 0,
        },
    )
    vehicle_id = response.json()["id"]

    purchase_response = client.post(
        f"/api/vehicles/{vehicle_id}/purchase",
        headers=_auth_headers(user_token),
        json={"quantity": 1},
    )

    assert purchase_response.status_code == 400
    assert "stock" in purchase_response.json()["detail"].lower()


def test_admin_can_restock_vehicle(client):
    admin_token = _register_and_login(client, "admin7@example.com", "AdminPass123!", role="admin")

    response = client.post(
        "/api/vehicles",
        headers=_auth_headers(admin_token),
        json={
            "make": "Lexus",
            "model": "RX",
            "category": "SUV",
            "price": 55999.0,
            "quantity": 0,
        },
    )
    vehicle_id = response.json()["id"]

    restock_response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=_auth_headers(admin_token),
        json={"quantity": 5},
    )

    assert restock_response.status_code == 200
    assert restock_response.json()["quantity"] == 5


def test_customer_cannot_restock_vehicle(client):
    admin_token = _register_and_login(client, "admin8@example.com", "AdminPass123!", role="admin")
    customer_token = _register_and_login(client, "customer8@example.com", "CustomerPass123!")

    response = client.post(
        "/api/vehicles",
        headers=_auth_headers(admin_token),
        json={
            "make": "Subaru",
            "model": "Impreza",
            "category": "Hatchback",
            "price": 27999.0,
            "quantity": 3,
        },
    )
    vehicle_id = response.json()["id"]

    restock_response = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=_auth_headers(customer_token),
        json={"quantity": 2},
    )

    assert restock_response.status_code == 403
