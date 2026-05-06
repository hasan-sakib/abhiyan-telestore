def test_register(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "newuser@test.com",
        "password": "securepass123",
        "full_name": "New User",
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


def test_register_duplicate_email(client, regular_user):
    response = client.post("/api/v1/auth/register", json={
        "email": regular_user.email,
        "password": "anypass123",
        "full_name": "Duplicate",
    })
    assert response.status_code == 400


def test_login_success(client, regular_user):
    response = client.post("/api/v1/auth/login", json={
        "email": "user@test.com",
        "password": "userpass123",
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client, regular_user):
    response = client.post("/api/v1/auth/login", json={
        "email": "user@test.com",
        "password": "wrongpassword",
    })
    assert response.status_code == 401


def test_login_unknown_email(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "ghost@test.com",
        "password": "anypass",
    })
    assert response.status_code == 401


def test_refresh_token(client, regular_user):
    login = client.post("/api/v1/auth/login", json={
        "email": "user@test.com",
        "password": "userpass123",
    })
    refresh_token = login.json()["refresh_token"]
    response = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_refresh_invalid_token(client):
    response = client.post("/api/v1/auth/refresh", json={"refresh_token": "bad.token.here"})
    assert response.status_code == 401


def test_get_me(client, user_headers):
    response = client.get("/api/v1/users/me", headers=user_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "user@test.com"


def test_get_me_unauthenticated(client):
    response = client.get("/api/v1/users/me")
    assert response.status_code == 401
