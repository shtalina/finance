from sqlalchemy import Integer, String, Column, Boolean, Float, ForeignKey
from database import Base


# User (id, email, password, name)
# Income (id, type, category_id, user_id, count )
# Expenses (id, type, category_id, user_id, count)
# Category (id, category_name)

class  User(Base):
    __tablename__ = "app_users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)
    is_active = Column(Boolean, default=True)

class  Income(Base):
    __tablename__ = "app_income"

    id = Column(Integer, primary_key=True)
    type = Column(String, nullable=False)  
    category_income_id = Column(Integer, ForeignKey('app_category_income.id'), nullable=False)  
    user_id = Column(String, ForeignKey('app_users.id'), nullable=False)  
    count = Column(Float, nullable=False) 

class  Expenses(Base):
    __tablename__ = "app_expenses"

    id = Column(Integer, primary_key=True)
    type = Column(String, nullable=False)  
    category_expenses_id = Column(Integer, ForeignKey('app_category_income.id'), nullable=False)  
    user_id = Column(String, ForeignKey('app_users.id'), nullable=False)  
    count = Column(Float, nullable=False) 
 
class  Category_income(Base):
    __tablename__ = "app_category_income"

    id = Column(Integer, primary_key=True)
    category_name = Column(String, nullable=False)

class  Category_expenses(Base):
    __tablename__ = "app_category_expenses"

    id = Column(Integer, primary_key=True)
    category_name = Column(String, nullable=False)