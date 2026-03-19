from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    dosage = Column(String, nullable=False)
    times_per_day = Column(Integer, nullable=False)
    course_days = Column(Integer, nullable=False)
    
    medicine_id = Column(Integer, ForeignKey("medicines.id", ondelete="CASCADE"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Связи
    medicine = relationship("Medicine", back_populates="reminders")
    owner = relationship("User", back_populates="reminders")