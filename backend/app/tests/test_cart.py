import uuid


def test_get_guest_cart(client):
    session_id = str(uuid.uuid4())
    response = client.get("/api/v1/cart/", headers={"x-session-id": session_id})
    assert response.status_code == 200
    assert response.json()["items"] == []


def test_add_item_to_guest_cart(client, sample_product):
    session_id = str(uuid.uuid4())
    response = client.post("/api/v1/cart/items", json={
        "product_id": sample_product.id,
        "quantity": 2,
        "session_id": session_id,
    })
    assert response.status_code == 200
    items = response.json()["items"]
    assert len(items) == 1
    assert items[0]["quantity"] == 2


def test_add_item_to_user_cart(client, user_headers, sample_product):
    response = client.post("/api/v1/cart/items", json={
        "product_id": sample_product.id,
        "quantity": 1,
    }, headers=user_headers)
    assert response.status_code == 200
    assert len(response.json()["items"]) >= 1


def test_remove_item_from_cart(client, user_headers, sample_product):
    add = client.post("/api/v1/cart/items", json={
        "product_id": sample_product.id,
        "quantity": 1,
    }, headers=user_headers)
    item_id = add.json()["items"][0]["id"]
    response = client.delete(f"/api/v1/cart/items/{item_id}", headers=user_headers)
    assert response.status_code == 200
    assert response.json()["items"] == []


def test_clear_cart(client, user_headers, sample_product):
    client.post("/api/v1/cart/items", json={
        "product_id": sample_product.id,
        "quantity": 1,
    }, headers=user_headers)
    response = client.delete("/api/v1/cart/", headers=user_headers)
    assert response.status_code == 200
    assert response.json()["items"] == []
