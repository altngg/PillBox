from pydantic import BaseModel, EmailStr
from typing import Optional

# Для регистрации (пароль в открытом виде)
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: Optional[str] = None

# Для входа
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Для ответа (без пароля!)
class UserRead(BaseModel):
    id: int
    email: EmailStr
    username: Optional[str] = None
    is_active: bool
    is_superuser: bool

    class Config:
        from_attributes = True