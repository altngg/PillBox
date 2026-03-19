from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def create_admin():
    db = SessionLocal()
    
    try:
        email = "admin@example.com"
        username = "admin"
        password = "admin123"
        
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"Admin with email {email} already exist")
            return
        
        hashed_pw = get_password_hash(password)
        admin_user = User(
            email=email,
            username=username,
            hashed_password=hashed_pw,
            is_superuser=True,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"Admin created:")
        print(f"   Email: {admin_user.email}")
        print(f"   Username: {admin_user.username}")
        print(f"   Пароль: {password}")
        print(f"   ID: {admin_user.id}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()