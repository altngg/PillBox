from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import Path
from app.models.medicine import Medicine as MedicineModel  
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from jose import JWTError, jwt
from typing import List

from app.database import get_db  
from app.core.security import oauth2_scheme, SECRET_KEY, ALGORITHM

from app.models.user import User
from app.crud.medicine import get_medicines, create_medicine, delete_medicine, update_medicine
from app.schemas.medicine import MedicineCreate, Medicine

router = APIRouter(prefix="/medicines", tags=["medicines"])

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


def get_user_medicine(
    medicine_id: int,
    db: Session,
    current_user: User
) -> MedicineModel:
    medicine = db.query(MedicineModel).filter(
        MedicineModel.id == medicine_id,
        MedicineModel.owner_id == current_user.id
    ).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found or not owned by you"
        )
    return medicine



@router.post("/", response_model=Medicine)
def create_medicine(
    medicine: MedicineCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_medicine = MedicineModel(**medicine.model_dump(), owner_id=current_user.id)
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@router.get("/", response_model=List[Medicine])
def read_medicines(
    name: str | None = None,
    purpose: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(MedicineModel).filter(MedicineModel.owner_id == current_user.id)
    
    if name:
        query = query.filter(MedicineModel.name.ilike(f"%{name}%"))
    
    if purpose:
        query = query.filter(MedicineModel.purpose.ilike(f"%{purpose}%"))
    
    return query.all()

@router.get("/{medicine_id}", response_model=Medicine)
def read_medicine(
    medicine_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    medicine = get_user_medicine(medicine_id, db, current_user)
    return medicine

@router.put("/{medicine_id}", response_model=Medicine)
def update_medicine(
    medicine_id: int = Path(..., gt=0),
    medicine_update: MedicineCreate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    medicine = get_user_medicine(medicine_id, db, current_user)
    for field, value in medicine_update.model_dump(exclude_unset=True).items():
        setattr(medicine, field, value)
    
    db.commit()
    db.refresh(medicine)
    return medicine

@router.delete("/{medicine_id}")
def delete_medicine(
    medicine_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    medicine = get_user_medicine(medicine_id, db, current_user)
    db.delete(medicine)
    db.commit()
    return {"message": "Medicine deleted successfully"}