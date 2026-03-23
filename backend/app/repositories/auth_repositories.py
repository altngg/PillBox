from app.models.user import RefreshToken

class AuthRepository:
    def __init__(self, db):
        self.db = db

    def save_refresh_token(self, user_id, token):
        rt = RefreshToken(user_id=user_id, token=token, is_revoked=False)
        self.db.add(rt)
        self.db.commit()

    def revoke_token(self, token):
        obj = self.db.query(RefreshToken).filter_by(token=token).first()
        if obj:
            obj.is_revoked = True
            self.db.commit()

    def get_token(self, token):
        return self.db.query(RefreshToken).filter_by(token=token).first()
