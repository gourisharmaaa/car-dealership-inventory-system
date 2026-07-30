"""Tests for vehicle management endpoints."""


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


def test_admin_can_add_vehicle(client):
    admin_token = _register_and_login(client, "admin@example.com", "AdminPass123!", role="admin")

    response = client.post(
        "/api/vehicles",
        headers=_auth_headers(admin_token),
        json={
            "make": "Toyota",
            "model": "Corolla",
            "category": "Sedan",
            "price": 24999.99,
            "quantity": 12,
        },
    )

    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Toyota"
    assert data["model"] == "Corolla"
    assert data["quantity"] == 12


def test_customer_cannot_add_vehicle(client):
    token = _register_and_login(client, "buyer@example.com", "BuyerPass123!")

    response = client.post(
        "/api/vehicles",
        headers=_auth_headers(token),
        json={
            "make": "Honda",
            "model": "Civic",
            "category": "Sedan",
            "price": 21999.99,
            "quantity": 8,
        },
    )

    assert response.status_code == 403


def test_authenticated_user_can_list_vehicles(client):
    admin_token = _register_and_login(client, "admin2@example.com", "AdminPass123!", role="admin")
    user_token = _register_and_login(client, "user2@example.com", "UserPass123!")

    client.post(
        "/api/vehicles",
        headers=_auth_headers(admin_token),
        json={
            "make": "Ford",
            "model": "Mustang",
            "category": "Coupe",
            "price": 37999.0,
            "quantity": 5,
        },
    )

    response = client.get("/api/vehicles", headers=_auth_headers(user_token))
    assert response.status_code == 200
    vehicles = response.json()
    assert len(vehicles) >= 1
    assert any(vehicle["make"] == "Ford" for vehicle in vehicles)


def test_search_vehicles_by_filters(client):
    admin_token = _register_and_login(client, "admin3@example.com", "AdminPass123!", role="admin")

    client.post(
        "/api/vehicles",
        headers=_auth_headers(admin_token),
        json={
            "make": "Tesla",
            "model": "Model 3",
            "category": "Electric",
            "price": 42999.0,
            "quantity": 4,
        },
    )

    response = client.get(
        "/api/vehicles/search?make=tesla&min_price=42000&max_price=45000",
        headers=_auth_headers(admin_token),
    )
    assert response.status_code == 200
    results = response.json()
    assert len(results) == 1
    assert results[0]["model"] == "Model 3"


def test_admin_can_update_and_delete_vehicle(client):
    admin_token = _register_and_login(client, "admin4@example.com", "AdminPass123!", role="admin")

    response = client.post(
        "/api/vehicles",
        headers=_auth_headers(admin_token),
        json={
            "make": "Chevrolet",
            "model": "Camaro",
            "category": "Sports",
            "price": 34999.0,
            "quantity": 3,
        },
    )
    vehicle_id = response.json()["id"]

    update_response = client.put(
        f"/api/vehicles/{vehicle_id}",
        headers=_auth_headers(admin_token),
        json={"price": 33999.0, "quantity": 2},
    )
    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated["price"] == 33999.0
    assert updated["quantity"] == 2

    delete_response = client.delete(
        f"/api/vehicles/{vehicle_id}",
        headers=_auth_headers(admin_token),
    )
    assert delete_response.status_code == 204

    list_response = client.get("/api/vehicles", headers=_auth_headers(admin_token))
    assert delete_response.status_code == 204
    assert all(vehicle["id"] != vehicle_id for vehicle in list_response.json())
