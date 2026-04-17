from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.medicines import router as medicines_router
from app.api.reminders import router as reminders_router
from app.api.admin import router as admin_router
from app.api import auth
from app.database import Base, engine
from app.core.minio_client import init_bucket
from app.api import seo
from app.api import external

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PillBox API", redirect_slashes=False )
@app.on_event("startup")
async def startup_event():
    init_bucket()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://host.docker.internal:5173",  
        "http://172.17.0.1:5173",           
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(medicines_router, prefix="/api/medicines", tags=["Medicines"])
app.include_router(reminders_router)
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(admin_router)
app.include_router(seo.router)
app.include_router(external.router)

@app.get("/")
def root():
    return {"message": "Welcome to PillBox API"}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "pillbox-backend"}