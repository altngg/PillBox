from fastapi import APIRouter, Depends, HTTPException, status, Path, Request, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc
from typing import List, Optional
from datetime import date
from jose import JWTError
import math

from app.database import get_db
from app.auth.jwt import decode_token
from app.models.user import User
from app.models.medicine import Medicine as MedicineModel
from app.schemas.medicine import (
    MedicineCreate, Medicine, MedicineUpdate, 
    PaginatedResponse
)
from app.core.minio_client import minio_client, ALLOWED_EXTENSIONS, MAX_FILE_SIZE

router = APIRouter(prefix="/medicines", tags=["medicines"])


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = request.cookies.get("access_token")
    if not token:
        raise credentials_exception

    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
    except (JWTError, TypeError, ValueError):
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
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


@router.get("/", response_model=PaginatedResponse)
def read_medicines(
    name: Optional[str] = Query(None, min_length=1, description="Поиск по названию"),
    purpose: Optional[str] = Query(None, min_length=1, description="Фильтр по назначению"),
    form: Optional[str] = Query(None, description="Фильтр по форме выпуска"),
    date_from: Optional[date] = Query(None, description="Дата добавления от"),
    date_to: Optional[date] = Query(None, description="Дата добавления до"),
    status: Optional[str] = Query(None, regex="^(expired|expiring_soon|valid|unknown)$", description="Фильтр по статусу"),
    
    page: int = Query(1, ge=1, description="Номер страницы"),
    size: int = Query(10, ge=1, le=100, description="Размер страницы"),
    sort_by: Optional[str] = Query(None, description="Поле для сортировки (name, expiry_date, created_at)"),
    sort_order: str = Query("asc", regex="^(asc|desc)$", description="Порядок сортировки"),
    
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    query = db.query(MedicineModel).filter(MedicineModel.owner_id == current_user.id)


    if name:
        query = query.filter(MedicineModel.name.ilike(f"%{name}%"))
    
    if purpose:
        query = query.filter(MedicineModel.purpose.ilike(f"%{purpose}%"))
    
    if form:
        query = query.filter(MedicineModel.form.ilike(f"%{form}%"))
    
    if date_from or date_to:
        if date_from:
            query = query.filter(MedicineModel.expiry_date >= date_from)
        if date_to:
            query = query.filter(MedicineModel.expiry_date <= date_to)

    if sort_by:
        sort_column = getattr(MedicineModel, sort_by, None)
        if sort_column is not None:
            query = query.order_by(desc(sort_column) if sort_order == "desc" else asc(sort_column))
        else:
            query = query.order_by(MedicineModel.id.desc())
    else:
        query = query.order_by(MedicineModel.id.desc())

    total = query.count()
    pages = math.ceil(total / size)
    offset = (page - 1) * size
    
    items = query.offset(offset).limit(size).all()
    
    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=pages
    )


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
    medicine_update: MedicineUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    medicine = get_user_medicine(medicine_id, db, current_user)
    
    update_data = medicine_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
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
    
    if medicine.photo_url:
        object_name = medicine.photo_url.split("/")[-1]
        try:
            minio_client.remove_object("pillbox", object_name)
        except Exception:
            pass  
    
    db.delete(medicine)
    db.commit()
    return {"message": "Medicine deleted successfully"}


@router.post("/{medicine_id}/photo")
def upload_medicine_photo(
    medicine_id: int = Path(..., gt=0),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    medicine = get_user_medicine(medicine_id, db, current_user)
    

    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недопустимый формат файла. Разрешены: JPEG, PNG, WebP"
        )
    
    if file.size and file.size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Файл слишком большой. Максимум {MAX_FILE_SIZE // (1024*1024)} МБ"
        )

    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Недопустимое расширение файла"
        )
    
    object_name = f"medicines/{current_user.id}/{medicine_id}/photo.{file_ext}"
    
    try:
        minio_client.upload_file(
            bucket_name="pillbox",
            object_name=object_name,
            file_data=file.file,
            content_type=file.content_type
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка загрузки файла: {str(e)}"
        )
    
    photo_url = minio_client.get_presigned_url("pillbox", object_name)
    
    medicine.photo_url = photo_url
    db.commit()
    db.refresh(medicine)
    
    return {"photo_url": photo_url}


@router.get("/{medicine_id}/photo")
def get_medicine_photo_url(
    medicine_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    medicine = get_user_medicine(medicine_id, db, current_user)
    
    if not medicine.photo_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Фотография не найдена"
        )
    
    object_name = medicine.photo_url.split("/")[-1]
    object_path = f"medicines/{current_user.id}/{medicine_id}/photo.{object_name.split('.')[-1]}"
    
    return {"photo_url": minio_client.get_presigned_url("pillbox", object_path)}


@router.delete("/{medicine_id}/photo")
def delete_medicine_photo(
    medicine_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    medicine = get_user_medicine(medicine_id, db, current_user)
    
    if not medicine.photo_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Фотография не найдена"
        )
    
    object_name = medicine.photo_url.split("/")[-1]
    try:
        minio_client.remove_object("pillbox", object_name)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка удаления файла: {str(e)}"
        )
    
    medicine.photo_url = None
    db.commit()
    
    return {"message": "Фотография удалена"}