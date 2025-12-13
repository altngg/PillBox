from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# Базовые схемы
class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = None

# Для создания
class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

# Для обновления
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    full_name: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8)

# Для ответа (без пароля)
class UserInDB(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# Для аутентификации
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Токен
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None