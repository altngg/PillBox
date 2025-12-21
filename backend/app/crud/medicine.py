from sqlalchemy.orm import Session
from app.models.medicine import Medicine
from app.schemas.medicine import MedicineCreate
from datetime import date

def get_medicine(db: Session, medicine_id: int):
    return db.query(Medicine).filter(Medicine.id == medicine_id).first()

def get_medicines(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Medicine).offset(skip).limit(limit).all()

def create_medicine(db: Session, medicine: MedicineCreate):
    db_medicine = Medicine(**medicine.model_dump())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

def delete_medicine(db: Session, medicine_id: int):
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if medicine:
        db.delete(medicine)
        db.commit()
    return medicine