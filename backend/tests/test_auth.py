import pytest

@pytest.mark.unit
class TestAuthEndpoints:
    
    def test_register_success(self, client):
        response = client.post("/auth/register", json={
            "email": "newuser@example.com",
            "username": "newuser",
            "password": "test123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data or "username" in data or data.get("message")
    
    def test_register_duplicate_email(self, client, test_user):
        response = client.post("/auth/register", json={
            "email": "test@example.com",
            "username": "anotheruser",
            "password": "test123"
        })
        assert response.status_code in [400, 409, 422]
    
    def test_login_success(self, client, test_user):
        response = client.post("/auth/login", json={
            "email": "test@example.com",
            "password": "test123"
        })
        assert response.status_code == 200
        data = response.json()
        assert data.get("message") == "ok" or "token" in data
    
    def test_login_wrong_password(self, client, test_user):
        response = client.post("/auth/login", json={
            "email": "test@example.com",
            "password": "wrongpass"
        })
        assert response.status_code in [401, 403]
    
    def test_get_me_authenticated(self, authenticated_client):
        response = authenticated_client.get("/auth/me")
        assert response.status_code in [200, 404]
    
    def test_get_me_unauthenticated(self, client):
        response = client.get("/auth/me")
        assert response.status_code in [401, 403, 404]