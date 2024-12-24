from pydantic import BaseModel
from datetime import datetime

class UserBase(BaseModel):
    email: str 

class authUser(UserBase):
    password: str

class UserCreate(UserBase):
    username: str
    password: str
    state_id: int

class CategoryCreate(BaseModel):
    category_name: str

class Category(CategoryCreate):
    id: int

class TransactionCreate(BaseModel):
    category_id: int
    koshelka_id: int   
    count: float


class RestoreAccount(BaseModel):
    restore_token: str 
    new_password: str 
    new_password_confirm: str

class KoshelkaCreateWithoutUser(BaseModel):
    valuta_id:int


class KoshelkaCreate(KoshelkaCreateWithoutUser):
    user_id:int | None = None

class StateCreate(BaseModel):
    name: str
    default_valuta_id: int


