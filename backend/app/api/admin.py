from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User as UserModel
from app.models.medicine import Medicine as MedicineModel
from app.models.reminder import Reminder as ReminderModel
from app.schemas.user import UserRead, UserCreate
from app.schemas.medicine import Medicine, MedicineCreate
from app.schemas.reminder import Reminder, ReminderCreate
from app.api.medicines import get_current_user  
from app.core.security import get_password_hash

router = APIRouter(prefix="/admin", tags=["admin"])

def require_superuser(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Требуются права администратора"
        )
    return current_user

@router.get("/users", response_model=List[UserRead])
def get_all_users(
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_superuser)
):
    return db.query(UserModel).all()

@router.post("/users", response_model=UserRead)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_superuser)
):
    existing = db.query(UserModel).filter(UserModel.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")
    hashed_pw = get_password_hash(user.password)
    db_user = UserModel(
        email=user.email,
        username=user.username,
        hashed_password=hashed_pw,
        is_active=True,
        is_superuser=False 
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_superuser)
):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    if user.is_superuser and user.id != admin.id:
        raise HTTPException(status_code=403, detail="Нельзя удалять других администраторов")
    db.delete(user)
    db.commit()
    return {"message": f"Пользователь {user.email} удалён"}

@router.patch("/users/{user_id}/make-superuser")
def make_user_superuser(
    user_id: int,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_superuser)
):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    user.is_superuser = True
    db.commit()
    return {"message": f"Пользователь {user.email} теперь админ"}

# получение препаратов

@router.get("/medicines", response_model=List[Medicine])
def get_all_medicines(
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_superuser)
):
    return db.query(MedicineModel).all()

@router.post("/medicines", response_model=Medicine)
def create_medicine_for_any_user(
    medicine: MedicineCreate,
    owner_id: int,  
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_superuser)
):
    owner = db.query(UserModel).filter(UserModel.id == owner_id).first()
    if not owner:
        raise HTTPException(status_code=404, detail="Владелец не найден")
    db_medicine = MedicineModel(**medicine.model_dump(), owner_id=owner_id)
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@router.delete("/medicines/{medicine_id}")
def delete_any_medicine(
    medicine_id: int,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_superuser)
):
    medicine = db.query(MedicineModel).filter(MedicineModel.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Препарат не найден")
    db.delete(medicine)
    db.commit()
    return {"message": f"Препарат '{medicine.name}' удалён админом {admin.email}"}

# получение напоминаний

@router.get("/reminders", response_model=List[Reminder])
def get_all_reminders(
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_superuser)
):
    return db.query(ReminderModel).all()

@router.post("/reminders", response_model=Reminder)
def create_reminder_for_any_user(
    reminder: ReminderCreate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_superuser)
):
    medicine = db.query(MedicineModel).filter(MedicineModel.id == reminder.medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Препарат не найден")
    db_reminder = ReminderModel(**reminder.model_dump(), owner_id=medicine.owner_id)
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

@router.delete("/reminders/{reminder_id}")
def delete_any_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(require_superuser)
):
    reminder = db.query(ReminderModel).filter(ReminderModel.id == reminder_id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Напоминание не найдено")
    db.delete(reminder)
    db.commit()
    return {"message": f"Напоминание удалено админом {admin.email}"}