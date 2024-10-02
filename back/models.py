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
    state_id=Column(Integer, ForeignKey('app_states.id'), nullable=False)

class  Income(Base):
    __tablename__ = "app_income"
    id = Column(Integer, primary_key=True)
    type = Column(String, nullable=False)  
    category_income_id = Column(Integer, ForeignKey('app_category_income.id'), nullable=False)  
    user_id = Column(String, ForeignKey('app_users.id'), nullable=False)  
    count = Column(Float, nullable=False)
    valuta_id=Column(Integer, ForeignKey('app_valuta.id'), nullable=False) 

class  Expenses(Base):
    __tablename__ = "app_expenses"
    id = Column(Integer, primary_key=True)
    type = Column(String, nullable=False)  
    category_expenses_id = Column(Integer, ForeignKey('app_category_income.id'), nullable=False)  
    user_id = Column(String, ForeignKey('app_users.id'), nullable=False)  
    count = Column(Float, nullable=False)
    valuta_id=Column(Integer, ForeignKey('app_valuta.id'), nullable=False) 
 
class  Category_income(Base):
    __tablename__ = "app_category_income"
    id = Column(Integer, primary_key=True)
    category_name = Column(String, nullable=False)

class  Category_expenses(Base):
    __tablename__ = "app_category_expenses"
    id = Column(Integer, primary_key=True)
    category_name = Column(String, nullable=False)

# Гос-во
class State(Base):
    __tablename__ = "app_states"
    id = Column(Integer, primary_key=True)
    name=Column(String)
    default_valuta_id=Column(Integer, ForeignKey('app_valuta.id'), nullable=False)

class Koshelka(Base):
    __tablename__ = "app_koshelkas"
    id = Column(Integer, primary_key=True)
    valuta_id=Column(Integer, ForeignKey('app_valuta.id'), nullable=False)
    cash=Column(Float, default=0)
    user_id=Column(Integer, ForeignKey('app_users.id'), nullable=False)

class Valuta(Base):
    __tablename__ = "app_valuta"
    id = Column(Integer, primary_key=True)
    name=Column(String)
