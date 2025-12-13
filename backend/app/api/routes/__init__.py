from fastapi import APIRouter

from .medicine import router as medicine_router
from .users import router as users_router
from .reminder import router as reminder_router

router = APIRouter()

router.include_router(medicine_router, prefix="/items", tags=["items"])
router.include_router(users_router, prefix="/users", tags=["users"])
router.include_router(reminder_router, prefix="/partners", tags=["partners"])