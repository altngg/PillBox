from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.reminder import Reminder as ReminderModel
from app.models.medicine import Medicine
from app.models.user import User
from app.schemas.reminder import ReminderCreate, ReminderUpdate, Reminder
from app.api.medicines import get_current_user  # переиспользуем вашу функцию

router = APIRouter(prefix="/reminders", tags=["reminders"])

# Вспомогательная функция: получить напоминание и проверить владение
def get_user_reminder(
    reminder_id: int,
    db: Session,
    current_user: User
) -> ReminderModel:
    reminder = db.query(ReminderModel).filter(
        ReminderModel.id == reminder_id,
        ReminderModel.owner_id == current_user.id
    ).first()
    if not reminder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Напоминание не найдено или не принадлежит вам"
        )
    return reminder

# === CREATE ===
@router.post("/", response_model=Reminder)
def create_reminder(
    reminder: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Проверяем, что препарат существует и принадлежит пользователю
    medicine = db.query(Medicine).filter(
        Medicine.id == reminder.medicine_id,
        Medicine.owner_id == current_user.id
    ).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Препарат не найден или не принадлежит вам"
        )
    
    db_reminder = ReminderModel(
        **reminder.model_dump(),
        owner_id=current_user.id
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

# === READ LIST ===
@router.get("/", response_model=List[Reminder])
def read_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(ReminderModel).filter(ReminderModel.owner_id == current_user.id).all()

# === READ ONE ===
@router.get("/{reminder_id}", response_model=Reminder)
def read_reminder(
    reminder_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_reminder(reminder_id, db, current_user)

# === UPDATE ===
@router.put("/{reminder_id}", response_model=Reminder)
def update_reminder(
    reminder_id: int = Path(..., gt=0),
    reminder_update: ReminderUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminder = get_user_reminder(reminder_id, db, current_user)
    
    # Проверяем, что новый medicine_id (если указан) принадлежит пользователю
    if reminder_update.medicine_id is not None:
        medicine = db.query(Medicine).filter(
            Medicine.id == reminder_update.medicine_id,
            Medicine.owner_id == current_user.id
        ).first()
        if not medicine:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Новый препарат не найден или не принадлежит вам"
            )
    
    # Обновляем поля
    for field, value in reminder_update.model_dump(exclude_unset=True).items():
        setattr(reminder, field, value)
    
    db.commit()
    db.refresh(reminder)
    return reminder

# === DELETE ===
@router.delete("/{reminder_id}")
def delete_reminder(
    reminder_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminder = get_user_reminder(reminder_id, db, current_user)
    db.delete(reminder)
    db.commit()
    return {"message": "Напоминание успешно удалено"}