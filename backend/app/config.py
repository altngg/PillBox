# # from pydantic_settings import BaseSettings
# # from typing import Optional

# # class Settings(BaseSettings):
# #     # Database
# #     DATABASE_URL: str
    
# #     # JWT
# #     SECRET_KEY: str
# #     ALGORITHM: str = "HS256"
# #     ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
# #     class Config:
# #         env_file = ".env"

# # settings = Settings()

# import os
# from dotenv import load_dotenv

# load_dotenv()  # Загружает переменные из .env файла

# DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pillbox.db")
# SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")