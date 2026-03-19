from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.medicines import router as medicines_router
from app.api.reminders import router as reminders_router
from app.api.admin import router as admin_router
from app.api.auth import router as auth_router
from app.database import Base, engine


Base.metadata.create_all(bind=engine)

app = FastAPI(title="PillBox API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://host.docker.internal:5173",  # Для Docker на Windows/macOS
        "http://172.17.0.1:5173",            # Для Linux
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(medicines_router)
app.include_router(reminders_router)
app.include_router(auth_router)
app.include_router(admin_router)

@app.get("/")
def root():
    return {"message": "Welcome to PillBox API"}