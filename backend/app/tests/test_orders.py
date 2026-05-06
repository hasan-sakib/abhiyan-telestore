SHIPPING = {
    "full_name": "Test User",
    "phone": "01700000000",
    "address_line1": "123 Main St",
    "city": "Dhaka",
    "state": "Dhaka",
    "postal_code": "1200",
    "country": "Bangladesh",
}


def _add_to_cart(client, headers, product_id):
    client.post("/api/v1/cart/items", json={"product_id": product_id, "quantity": 1}, headers=headers)


def test_create_order(client, user_headers, sample_product):
    _add_to_cart(client, user_headers, sample_product.id)
    response = client.post("/api/v1/orders/", json={"shipping_address": SHIPPING}, headers=user_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "pending"
    assert data["total_amount"] > 0


def test_list_my_orders(client, user_headers, sample_product):
    _add_to_cart(client, user_headers, sample_product.id)
    client.post("/api/v1/orders/", json={"shipping_address": SHIPPING}, headers=user_headers)
    response = client.get("/api/v1/orders/", headers=user_headers)
    assert response.status_code == 200
    assert response.json()["total"] >= 1


def test_create_order_empty_cart_fails(client, user_headers):
    # Clear cart first
    client.delete("/api/v1/cart/", headers=user_headers)
    response = client.post("/api/v1/orders/", json={"shipping_address": SHIPPING}, headers=user_headers)
    assert response.status_code == 400


def test_admin_update_order_status(client, admin_headers, user_headers, sample_product):
    _add_to_cart(client, user_headers, sample_product.id)
    order = client.post("/api/v1/orders/", json={"shipping_address": SHIPPING}, headers=user_headers).json()
    order_id = order["id"]

    response = client.patch(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "confirmed"},
        headers=admin_headers,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "confirmed"


def test_invalid_status_transition(client, admin_headers, user_headers, sample_product):
    _add_to_cart(client, user_headers, sample_product.id)
    order = client.post("/api/v1/orders/", json={"shipping_address": SHIPPING}, headers=user_headers).json()
    order_id = order["id"]

    # pending → shipped is invalid (must go through confirmed first)
    response = client.patch(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "shipped"},
        headers=admin_headers,
    )
    assert response.status_code == 400


def test_customer_cannot_update_order_status(client, user_headers, sample_product):
    _add_to_cart(client, user_headers, sample_product.id)
    order = client.post("/api/v1/orders/", json={"shipping_address": SHIPPING}, headers=user_headers).json()
    response = client.patch(
        f"/api/v1/orders/{order['id']}/status",
        json={"status": "confirmed"},
        headers=user_headers,
    )
    assert response.status_code == 403
