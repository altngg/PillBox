from app.models import RefreshToken
from app.models import User
from sqlalchemy.orm import Session

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_username(self, username: str):
        return self.db.query(User).filter(User.username == username).first()
        
    def save_refresh_token(self, user_id: int, token: str):
        db_token = RefreshToken(user_id=user_id, token=token)
        self.db.add(db_token)
        self.db.commit()