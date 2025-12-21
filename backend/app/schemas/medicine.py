from __future__ import annotations
from pydantic import BaseModel, computed_field
from datetime import date, timedelta
from typing import List, Optional

class MedicineBase(BaseModel):
    name: str
    form: str
    purpose: Optional[str] = None
    manufacture_date: Optional[date] = None
    expiry_date: Optional[date] = None

class MedicineCreate(MedicineBase):
    pass

class Medicine(MedicineBase):
    id: int
    reminders: List[Reminder] = []

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

from app.schemas.reminder import Reminder