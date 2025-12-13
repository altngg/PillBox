from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Time, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Reminder(Base):
    __tablename__ = "reminders"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)


    #Доза
    dosage = Column(String)  # например: "500 мг"

    # Время приема
    reminder_time = Column(Time, nullable=False)
    
    # Расписание (можно хранить как JSON)
    schedule = Column(JSON)  # {"days": [1,2,3,4,5,6,7], "interval_hours": 8}
    
    # Статус
    is_active = Column(Boolean, default=True)
    
    # Внешние ключи
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=True)  # может быть без лекарства
    
    # Связи
    user = relationship("User", back_populates="reminders")
    medicine = relationship("Medicine", back_populates="reminders")
    
    # Метаданные
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Последнее срабатывание
    last_triggered = Column(DateTime(timezone=True))