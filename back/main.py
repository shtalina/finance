from fastapi import FastAPI
from models import Regrequest, Auth

app = FastAPI()

@app.get("/hello")
async def read_root():
    return {"Hello": "World"}

@app.post("/reg")
async def reg(item: Regrequest):
    return{
         'status':True
    }

@app.get("/auth")
async def auth(item: Auth):
    return{
         'status':True
    }
