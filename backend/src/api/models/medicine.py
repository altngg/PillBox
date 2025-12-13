from models import medicine 
from database.db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Float, CheckConstraint, Date 
from sqlalchemy.orm import relationship

class Medicine(Base):

    __tablename__ = "medicine"
    id = Column(Integer, primary_key=True, autoincrement = True)
    