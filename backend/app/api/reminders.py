from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, Reminder
from app.models.reminder import Reminder as ReminderModel
from app.models.medicine import Medicine
from app.models.user import User
from app.api.medicines import get_current_user  

router = APIRouter(prefix="/reminders", tags=["reminders"])

@router.post("/", response_model=Reminder)  # ← возвращаем Reminder (с id)
def create_reminder(
    reminder: ReminderCreate,  # ← принимаем ReminderCreate (без id)
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Проверяем, что medicine существует и принадлежит пользователю
    medicine = db.query(Medicine).filter(
        Medicine.id == reminder.medicine_id,
        Medicine.owner_id == current_user.id
    ).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    db_reminder = ReminderModel(
        **reminder.model_dump(),
        owner_id=current_user.id
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder  # Pydantic автоматически конвертирует в Reminder (с id)