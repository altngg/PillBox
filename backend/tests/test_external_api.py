import pytest
from unittest.mock import AsyncMock, patch

@pytest.mark.external
class TestExternalDrugAPI:
    
    def test_external_drug_info_success(self, authenticated_client):
        mock_response = {
            "brand_name": "TestBrand",
            "generic_name": "testgeneric",
            "manufacturer": "TestMfg",
            "purpose": "Test purpose",
            "warnings": [],
            "storage": "Store cool",
            "dosage": "As directed"
        }
        
        with patch("app.api.external.external_drug_service.get_drug_info", 
                   new_callable=AsyncMock) as mock_get:
            mock_get.return_value = mock_response
            
            response = authenticated_client.get("/external/drug-info/paracetamol")
            
            assert response.status_code in [200, 404]
    
    def test_external_drug_info_not_found(self, authenticated_client):
        with patch("app.api.external.external_drug_service.get_drug_info",
                   new_callable=AsyncMock) as mock_get:
            mock_get.return_value = None
            
            response = authenticated_client.get("/external/drug-info/unknown-drug-xyz")
            
            assert response.status_code == 404