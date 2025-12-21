from pydantic import BaseModel
from typing import Optional

class ReminderBase(BaseModel):
    dosage: str
    times_per_day: int
    course_days: int
    medicine_id: int

class ReminderCreate(ReminderBase):
    pass

class Reminder(ReminderBase):
    id: int

    class Config:
        from_attributes = True