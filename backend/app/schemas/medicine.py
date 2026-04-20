from __future__ import annotations
from pydantic import BaseModel, computed_field, Field, ConfigDict
from datetime import date, timedelta
from typing import List, Optional

class MedicineBase(BaseModel):
    name: str
    form: str
    purpose: Optional[str] = None
    manufacture_date: Optional[date] = None
    expiry_date: Optional[date] = None
    photo_url: Optional[str] = None


class MedicineCreate(MedicineBase):
    pass


class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    form: Optional[str] = None
    purpose: Optional[str] = None
    manufacture_date: Optional[date] = None
    expiry_date: Optional[date] = None
    photo_url: Optional[str] = None


class Medicine(MedicineBase):
    id: int
    owner_id: int
    reminders: List[dict] = []

    @computed_field
    @property
    def status(self) -> str:
        expiry = self.expiry_date
        if expiry is None:
            return "unknown"
        today = date.today()
        if expiry < today:
            return "expired"
        elif expiry <= today + timedelta(days=30):
            return "expiring_soon"
        else:
            return "valid"

    class Config:
        from_attributes = True


# pagination
class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1, description="Номер страницы")
    size: int = Field(default=10, ge=1, le=100, description="Размер страницы")
    sort_by: Optional[str] = Field(default=None, description="Поле для сортировки")
    sort_order: Optional[str] = Field(default="asc", pattern="^(asc|desc)$", description="Порядок сортировки")


class PaginatedResponse(BaseModel):
    items: List[Medicine]
    total: int
    page: int
    size: int
    pages: int

    has_next: bool
    has_prev: bool

    model_config = ConfigDict(from_attributes=True)