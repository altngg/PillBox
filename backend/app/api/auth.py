from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.schemas import LoginSchema, TokenResponse
from app.schemas.user import UserCreate, UserRead
from app.services.auth_service import AuthService
from app.auth.jwt import decode_token

router = APIRouter(tags=["auth"])

def set_auth_cookies(response, access_token, refresh_token):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        path="/"
    )

@router.post("/register", response_model=UserRead)
def register(data: UserCreate, db: Session = Depends(get_db)):
    service = AuthService(db)
    user = service.register(data.email, data.password, data.username)

    if not user:
        raise HTTPException(status_code=400, detail="Email already registered")

    return user

@router.post("/login")
def login(data: LoginSchema, response: Response, db: Session = Depends(get_db)):
    service = AuthService(db)

    user = service.authenticate(data.email, data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    tokens = service.create_tokens(user.id)
    service.save_refresh_token(user.id, tokens["refresh_token"])
    set_auth_cookies(response, tokens["access_token"], tokens["refresh_token"])

    return {"message": "ok"}

@router.post("/refresh")
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):
    service = AuthService(db)
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="No refresh token")

    try:
        user_id = service.verify_refresh_token(refresh_token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    tokens = service.create_tokens(user_id)
    service.rotate_refresh_token(user_id, refresh_token, tokens["refresh_token"])
    set_auth_cookies(response, tokens["access_token"], tokens["refresh_token"])

    return {"message": "refreshed"}

@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    service = AuthService(db)
    refresh_token = request.cookies.get("refresh_token")

    if refresh_token:
        service.revoke_refresh_token(refresh_token)

    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")

    return {"message": "logged out"}

@router.get("/me", response_model=UserRead)
def me(request: Request, db: Session = Depends(get_db)):
    access_token = request.cookies.get("access_token")

    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = decode_token(access_token)
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=401, detail="Not authenticated")

    service = AuthService(db)
    user = service.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return user
