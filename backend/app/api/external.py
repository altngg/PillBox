from fastapi import APIRouter, HTTPException, Path, Query
from typing import Optional
from app.services.external_drug_api import external_drug_service

router = APIRouter(tags=["External API"])

@router.get("/drug-info/{drug_name}")
async def get_external_drug_info(drug_name: str = Path(..., description="Название препарата")):
    try:
        drug_info = await external_drug_service.get_drug_info(drug_name)
        
        if not drug_info:
            raise HTTPException(status_code=404, detail="Информация не найдена")
        
        return drug_info
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=503, detail="Сервис недоступен")