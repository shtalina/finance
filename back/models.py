from pydantic import BaseModel

class Regrequest(BaseModel):
    username: str
    email: str 
    password: str

class Auth(BaseModel):
    email: str 
    password: str