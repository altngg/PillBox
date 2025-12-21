from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from typing import List

from app.database import get_db  
from app.core.security import oauth2_scheme, SECRET_KEY, ALGORITHM

from app.models.user import User
from app.crud.medicine import get_medicines, create_medicine, delete_medicine
from app.schemas.medicine import MedicineCreate, Medicine

router = APIRouter(prefix="/medicines", tags=["medicines"])
# Получение текущего пользователя
def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Создание препарата — теперь с owner_id
@router.post("/", response_model=Medicine)
def create_medicine(
    medicine: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_medicine = Medicine(**medicine.model_dump(), owner_id=current_user.id)
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

# Получение — только своих препаратов
@router.get("/", response_model=list[Medicine])
def read_medicines(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Medicine).filter(Medicine.owner_id == current_user.id).all()