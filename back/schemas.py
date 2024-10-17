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


class RestoreAccount(BaseModel):
    restore_token: str 
    new_password: str 
    new_password_confirm: str

class KoshelkaCreate(BaseModel):
    valuta_id:int
    user_id:int | None = None

class StateCreate(BaseModel):
    name: str
    default_valuta_id: int


