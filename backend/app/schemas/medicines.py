from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class MedicineBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    manufacturer: Optional[str] = None
    dosage: Optional[str] = None
    form: Optional[str] = None
    quantity: int = Field(1, ge=1)
    expiration_date: date

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    manufacturer: Optional[str] = None
    dosage: Optional[str] = None
    form: Optional[str] = None
    quantity: Optional[int] = Field(None, ge=1)
    expiration_date: Optional[date] = None

class MedicineInDB(MedicineBase):
    id: int
    user_id: int
    days_until_expiration: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Для списка с пагинацией
class MedicineList(BaseModel):
    items: list[MedicineInDB]
    total: int
    page: int
    size: int
    pages: int