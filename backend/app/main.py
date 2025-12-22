from fastapi import FastAPI
from app.api.medicines import router as medicines_router
from app.api.reminders import router as reminders_router
from app.api.auth import router as auth_router
from app.database import Base, engine

# Создаём таблицы (если не используем alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PillBox API")

app.include_router(medicines_router)
app.include_router(reminders_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "Welcome to PillBox API"}