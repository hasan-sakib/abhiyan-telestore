import pytest
import app.database as db_module
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool
from sqlalchemy import event
from app.main import app
from app.database import get_db
from app.models.user import User
from app.models.category import Category
from app.models.product import Product, ProductStatus
from app.core.security import get_password_hash, create_access_token


def _make_engine():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_conn, _):
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    return engine


# Function-scoped engine: each test gets a fresh in-memory DB (no data leaks)
@pytest.fixture(name="engine")
def engine_fixture():
    engine = _make_engine()
    db_module.engine = engine  # patch global so on_startup uses SQLite
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="db")
def db_fixture(engine):
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="admin_user")
def admin_user_fixture(db):
    user = User(
        email="admin@test.com",
        hashed_password=get_password_hash("adminpass123"),
        full_name="Admin User",
        is_superuser=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(name="regular_user")
def regular_user_fixture(db):
    user = User(
        email="user@test.com",
        hashed_password=get_password_hash("userpass123"),
        full_name="Regular User",
        is_superuser=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture(name="admin_headers")
def admin_headers_fixture(admin_user):
    token = create_access_token(admin_user.id)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(name="user_headers")
def user_headers_fixture(regular_user):
    token = create_access_token(regular_user.id)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(name="sample_category")
def sample_category_fixture(db):
    cat = Category(name="Smartphones", slug="smartphones")
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@pytest.fixture(name="sample_product")
def sample_product_fixture(db, sample_category):
    product = Product(
        name="Samsung Galaxy S24",
        slug="samsung-galaxy-s24",
        price=799.99,
        stock_quantity=10,
        status=ProductStatus.in_stock,
        category_id=sample_category.id,
        brand="Samsung",
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
