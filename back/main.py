from fastapi import Depends, FastAPI, HTTPException

from database import SessionLocal, engine
from sqlalchemy.orm import Session
from sqlalchemy import select

import models
import schemas

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

@app.get("/")
def read_root():
    return {"hello":"World"}

@app.post("/registration")
def registration(user: schemas.UserCreate, db: Session = Depends(get_db)):
    fake_hashed_password=user.password + "soli"
    db_user=models.User(
        email=user.email,
        username=user.username,
        password=user.fake_hashed_password,
        state_id=user.state_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db_koshelka=models.Koshelka(
        valuta_id = db.execute(select(models.Valuta).where(models.Valuta.state_id == user.state_id)).scalar_one_or_none().id,
        user_id=db_user.id
    )
    db.add(db_koshelka)
    db.commit()
    return db_user
    
    # user = db.query(models.User).filter(models.User.email == email).first()

    # return {'status':True}

@app.get("/users")
def users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.get("/states")
def states(db: Session = Depends(get_db)):
    return db.query(models.State).all()


