def test_list_products_public(client, sample_product):
    response = client.get("/api/v1/products/")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 1


def test_get_product_by_slug(client, sample_product):
    response = client.get(f"/api/v1/products/{sample_product.slug}")
    assert response.status_code == 200
    assert response.json()["slug"] == sample_product.slug


def test_get_product_not_found(client):
    response = client.get("/api/v1/products/nonexistent-slug")
    assert response.status_code == 404


def test_create_product_as_admin(client, admin_headers, sample_category):
    response = client.post("/api/v1/products/", json={
        "name": "iPhone 15 Pro",
        "description": "Latest iPhone",
        "price": 1199.0,
        "stock_quantity": 25,
        "brand": "Apple",
        "model": "iPhone 15 Pro",
        "category_id": sample_category.id,
    }, headers=admin_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["slug"] == "iphone-15-pro"
    assert data["brand"] == "Apple"


def test_create_product_as_customer_forbidden(client, user_headers):
    response = client.post("/api/v1/products/", json={
        "name": "Test Phone",
        "price": 100.0,
    }, headers=user_headers)
    assert response.status_code == 403


def test_create_product_unauthenticated(client):
    response = client.post("/api/v1/products/", json={
        "name": "Test Phone",
        "price": 100.0,
    })
    assert response.status_code == 401


def test_update_product_as_admin(client, admin_headers, sample_product):
    response = client.put(f"/api/v1/products/{sample_product.id}", json={
        "price": 899.99,
        "stock_quantity": 5,
    }, headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["price"] == 899.99


def test_delete_product_as_admin(client, admin_headers, db):
    from app.models.product import Product, ProductStatus
    p = Product(name="Temp Phone", slug="temp-phone", price=100.0, stock_quantity=1)
    db.add(p)
    db.commit()
    db.refresh(p)
    response = client.delete(f"/api/v1/products/{p.id}", headers=admin_headers)
    assert response.status_code == 204


def test_filter_products_by_category(client, sample_product, sample_category):
    response = client.get(f"/api/v1/products/?category_slug={sample_category.slug}")
    assert response.status_code == 200
    assert response.json()["total"] >= 1


def test_search_products(client, sample_product):
    response = client.get("/api/v1/products/?search=Samsung")
    assert response.status_code == 200
    assert response.json()["total"] >= 1


def test_filter_by_price_range(client, sample_product):
    response = client.get("/api/v1/products/?min_price=500&max_price=1000")
    assert response.status_code == 200
