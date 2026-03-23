from app.repositories.auth_repositories import AuthRepository
from app.models.user import User
from app.auth.jwt import create_access_token, create_refresh_token, decode_token
from app.core.security import verify_password, get_password_hash

class AuthService:
    def __init__(self, db):
        self.repo = AuthRepository(db)
        self.db = db

    def authenticate(self, email, password):
        user = self.db.query(User).filter(User.email == email).first()

        if not user:
            return None

        try:
            if verify_password(password, user.hashed_password):
                return user
        except Exception:
            pass

        if user.hashed_password == password:
            return user

        return None

    def register(self, email, password, username=None):
        exists = self.db.query(User).filter(User.email == email).first()
        if exists:
            return None

        user = User(
            email=email,
            username=username,
            hashed_password=get_password_hash(password),
            is_active=True,
            is_superuser=False
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def create_tokens(self, user_id):
        access = create_access_token({"sub": str(user_id)})
        refresh = create_refresh_token({"sub": str(user_id)})

        return {
            "access_token": access,
            "refresh_token": refresh
        }

    def save_refresh_token(self, user_id, token):
        self.repo.save_refresh_token(user_id, token)

    def verify_refresh_token(self, token):
        data = decode_token(token)
        db_token = self.repo.get_token(token)

        if not db_token:
            raise Exception("Invalid refresh token")

        if db_token.is_revoked:
            raise Exception("Invalid refresh token")

        return int(data["sub"])

    def rotate_refresh_token(self, user_id, old_token, new_token):
        self.repo.revoke_token(old_token)
        self.repo.save_refresh_token(user_id, new_token)

    def revoke_refresh_token(self, token):
        self.repo.revoke_token(token)

    def get_user_by_id(self, user_id):
        return self.db.query(User).filter(User.id == user_id).first()
