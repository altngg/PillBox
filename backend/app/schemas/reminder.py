from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import time, datetime

class ReminderBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    reminder_time: time
    schedule: Dict = Field(default={"days": [1, 2, 3, 4, 5, 6, 7], "interval_hours": 24})
    is_active: bool = True
    medicine_id: Optional[int] = None

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    dosage: Optional[str] = None
    reminder_time: Optional[time] = None
    schedule: Optional[Dict] = None
    is_active: Optional[bool] = None
    medicine_id: Optional[int] = None

class ReminderInDB(ReminderBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    last_triggered: Optional[datetime]
    
    class Config:
        from_attributes = True