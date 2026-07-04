SHIPPING = {
    "full_name": "Test User",
    "phone": "01700000000",
    "address_line1": "123 Main St",
    "city": "Dhaka",
    "state": "Dhaka",
    "postal_code": "1200",
    "country": "Bangladesh",
}


def _order_payload(product_id, quantity=1):
    return {"items": [{"product_id": product_id, "quantity": quantity}], "shipping_address": SHIPPING}


def test_create_order(client, user_headers, sample_product):
    response = client.post("/api/v1/orders/", json=_order_payload(sample_product.id), headers=user_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "pending"
    assert data["total_amount"] > 0
    assert data["items"][0]["product_name"] == sample_product.name


def test_create_order_decrements_stock(client, user_headers, sample_product):
    initial_stock = sample_product.stock_quantity
    response = client.post("/api/v1/orders/", json=_order_payload(sample_product.id, 3), headers=user_headers)
    assert response.status_code == 201
    response = client.get(f"/api/v1/products/{sample_product.slug}", headers=user_headers)
    assert response.json()["stock_quantity"] == initial_stock - 3


def test_create_order_exceeds_stock_fails(client, user_headers, sample_product):
    response = client.post(
        "/api/v1/orders/", json=_order_payload(sample_product.id, sample_product.stock_quantity + 1), headers=user_headers
    )
    assert response.status_code == 400


def test_list_my_orders(client, user_headers, sample_product):
    client.post("/api/v1/orders/", json=_order_payload(sample_product.id), headers=user_headers)
    response = client.get("/api/v1/orders/", headers=user_headers)
    assert response.status_code == 200
    assert response.json()["total"] >= 1


def test_create_order_empty_items_fails(client, user_headers):
    response = client.post(
        "/api/v1/orders/", json={"items": [], "shipping_address": SHIPPING}, headers=user_headers
    )
    assert response.status_code == 400


def test_admin_update_order_status(client, admin_headers, user_headers, sample_product):
    order = client.post("/api/v1/orders/", json=_order_payload(sample_product.id), headers=user_headers).json()
    order_id = order["id"]

    response = client.patch(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "confirmed"},
        headers=admin_headers,
    )
    assert response.status_code == 200
    assert response.json()["status"] == "confirmed"


def test_invalid_status_transition(client, admin_headers, user_headers, sample_product):
    order = client.post("/api/v1/orders/", json=_order_payload(sample_product.id), headers=user_headers).json()
    order_id = order["id"]

    # pending → shipped is invalid (must go through confirmed first)
    response = client.patch(
        f"/api/v1/orders/{order_id}/status",
        json={"status": "shipped"},
        headers=admin_headers,
    )
    assert response.status_code == 400


def test_customer_cannot_update_order_status(client, user_headers, sample_product):
    order = client.post("/api/v1/orders/", json=_order_payload(sample_product.id), headers=user_headers).json()
    response = client.patch(
        f"/api/v1/orders/{order['id']}/status",
        json={"status": "confirmed"},
        headers=user_headers,
    )
    assert response.status_code == 403
