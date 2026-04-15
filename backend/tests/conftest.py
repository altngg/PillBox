import pytest
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db

DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, cookies={"session": "test_session"}) as test_client:
        try:
            yield test_client
        finally:
            app.dependency_overrides.clear()

@pytest.fixture
def test_user(db_session):
    from app.models.user import User
    
    user = User(
        email="test@example.com",
        username="testuser",
        hashed_password="test123"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def test_medicine(db_session, test_user):
    from datetime import date, timedelta
    from app.models.medicine import Medicine
    
    medicine = Medicine(
        name="Test Medicine",
        form="tablets",
        purpose="Test purpose",
        manufacture_date=date.today() - timedelta(days=30),
        expiry_date=date.today() + timedelta(days=365),
        owner_id=test_user.id
    )
    db_session.add(medicine)
    db_session.commit()
    db_session.refresh(medicine)
    return medicine

@pytest.fixture
def authenticated_client(client, test_user):
    client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "test123"
    })
    return client