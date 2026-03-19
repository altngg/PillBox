from pydantic import BaseModel
from typing import Optional

class ReminderBase(BaseModel):
    dosage: str
    times_per_day: int
    course_days: int
    medicine_id: int

class ReminderCreate(ReminderBase):
    pass

class ReminderUpdate(ReminderCreate):
    dosage: Optional[str] = None
    times_per_day: Optional[int] = None
    course_days: Optional[int] = None
    medicine_id: Optional[int] = None

class Reminder(ReminderBase):
    id: int

    class Config:
        from_attributes = True