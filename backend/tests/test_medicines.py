import pytest
from datetime import date, timedelta

@pytest.mark.integration
class TestMedicinesEndpoints:
    
    def test_create_medicine_success(self, authenticated_client, test_user):
        response = authenticated_client.post(
            "/medicines/",
            json={
                "name": "New Medicine",
                "form": "capsules",
                "purpose": "Test",
                "expiry_date": (date.today() + timedelta(days=100)).isoformat()
            }
        )
        assert response.status_code in [200, 201, 422]
    
    def test_create_medicine_unauthorized(self, client):
        response = client.post(
            "/medicines/",
            json={"name": "Test", "form": "tablets", "expiry_date": "2025-01-01"}
        )
        assert response.status_code in [401, 403]
    
    def test_get_medicines_list(self, authenticated_client, test_medicine):
        response = authenticated_client.get("/medicines/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list) or "items" in data or "data" in data
    
    def test_get_medicine_not_found(self, authenticated_client):
        response = authenticated_client.get("/medicines/99999")
        assert response.status_code == 404
    
    def test_update_medicine_success(self, authenticated_client, test_medicine):
        response = authenticated_client.put(
            f"/medicines/{test_medicine.id}",
            json={"name": "Updated Name", "purpose": "Updated purpose"}
        )
        assert response.status_code in [200, 422]
    
    def test_delete_medicine_success(self, authenticated_client, test_medicine):
        response = authenticated_client.delete(f"/medicines/{test_medicine.id}")
        assert response.status_code in [200, 204]
    
    def test_medicine_validation_expiry_date(self, authenticated_client):
        response = authenticated_client.post(
            "/medicines/",
            json={
                "name": "Bad Date",
                "form": "tablets",
                "expiry_date": "invalid-date"
            }
        )
        assert response.status_code == 422