import httpx
import os
from typing import Optional, Dict, Any

API_NINJAS_URL = "https://api.api-ninjas.com/v1/drugs"
API_KEY = os.getenv("API_NINJAS_KEY", "")

class ExternalDrugService:
    def __init__(self):
        self.timeout = httpx.Timeout(10.0, connect=5.0)
        self._mock_cache = self._init_mock_cache()

    def _init_mock_cache(self) -> Dict[str, Dict[str, Any]]:
        return {
            "paracetamol": {
                "brand_name": "Панадол, Эффералган",
                "generic_name": "Paracetamol",
                "manufacturer": "GlaxoSmithKline",
                "purpose": "Жаропонижающее и обезболивающее средство",
                "warnings": ["Не превышать дозу 4г в сутки", "Осторожно при заболеваниях печени"],
                "storage": "Хранить при температуре не выше 25°C",
                "dosage": "500-1000 мг каждые 4-6 часов"
            },
            "ibuprofen": {
                "brand_name": "Нурофен, Миг",
                "generic_name": "Ibuprofen", 
                "manufacturer": "Reckitt Benckiser",
                "purpose": "НПВС: обезболивающее, противовоспалительное",
                "warnings": ["Не принимать при язве желудка", "Проконсультироваться с врачом при беременности"],
                "storage": "Хранить в сухом месте",
                "dosage": "200-400 мг каждые 4-6 часов"
            },
            "aspirin": {
                "brand_name": "Аспирин, Тромбо АСС",
                "generic_name": "Acetylsalicylic acid",
                "manufacturer": "Bayer",
                "purpose": "НПВС, антиагрегант",
                "warnings": ["Не давать детям до 15 лет", "Противопоказан при язве"],
                "storage": "Хранить в оригинальной упаковке",
                "dosage": "100-300 мг в сутки"
            }
        }

    async def get_drug_info(self, drug_name: str) -> Optional[Dict[str, Any]]:
        normalized = drug_name.strip().lower()

        if API_KEY:
            try:
                headers = {"X-Api-Key": API_KEY}
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.get(
                        API_NINJAS_URL, 
                        headers=headers, 
                        params={"name": normalized}
                    )
                    if response.status_code == 200:
                        data = response.json()
                        if data and len(data) > 0:
                            return self._normalize_api_ninjas(data[0])
            except Exception:
                pass  
        
        if normalized in self._mock_cache:
            return self._mock_cache[normalized]
        
        for key, value in self._mock_cache.items():
            if key in normalized or normalized in key:
                return value
        
        return None

    def _normalize_api_ninjas(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "brand_name": raw_data.get("brand_name"),
            "generic_name": raw_data.get("generic_name"), 
            "manufacturer": raw_data.get("manufacturer"),
            "purpose": raw_data.get("description"),
            "warnings": [],
            "storage": "Хранить в недоступном для детей месте",
            "dosage": "Согласно инструкции"
        }

external_drug_service = ExternalDrugService()