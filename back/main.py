from fastapi import Depends, FastAPI, HTTPException

from database import SessionLocal, engine
from sqlalchemy.orm import Session
from sqlalchemy import select
import crud
import models
import schemas
from db import get_db 
from helpers import generate_token
import datetime
from auth_service import user_auth



models.Base.metadata.create_all(bind=engine)
 
app = FastAPI()

@app.get("/")
def read_root():
    return {"hello":"World"}

@app.post("/registration")
def registration(user: schemas.UserCreate, db: Session = Depends(get_db)):   
    if crud.existence_email(db=db, email=user.email):
       raise HTTPException(status_code=400, detail="Email должен быть уникальным") 
    db_user=crud.create_user(db=db, user=user)
    valuta_id=crud.get_default_valuta(db=db, state_id=user.state_id)
    db_koshelka=crud.create_koshelka(db=db,koshelka={"user_id": db_user.id, "valuta_id": valuta_id})
    return db_user
    
@app.post("/auth")
def auth(user:schemas.authUser, db: Session = Depends(get_db)):
    limit_time_min=5
    user_log = schemas.UserBase(email=user.email)
    db_user_log=crud.create_user_loggin(db=db, user_log=user_log)
    user_logs_by_time = crud.user_logs_by_time(db=db,time_min=limit_time_min,email=user.email)
    limit_attempts = 5
    if len(user_logs_by_time) >=limit_attempts:
        raise HTTPException(status_code=404, detail="Использованы все попытки")
    user=crud.auth(db=db, user=user)
    return user

@app.post("/restore_password")
def restore_password(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == email,
    ).first()

    restore_token = generate_token()
    user.restore_token = restore_token
    db.commit()
    db.refresh(user)

    return {
        'restore_token': restore_token,
    }


@app.post("/restore_account")
def restore_account(restore:schemas.RestoreAccount, db: Session = Depends(get_db),):
    
    user = db.query(models.User).filter(
        models.User.restore_token == restore.restore_token,
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail='User not found')
    
    if restore.new_password != restore.new_password_confirm:
        raise HTTPException(status_code=400, detail='Пароли не совпадают')

    fake_hashed_password = restore.new_password + "soli"
    user.password = fake_hashed_password
    user.restore_token = None

    db.commit()
    db.refresh(user)

    return {
        'status': True,
    }

@app.post("/states_create")
def states_create(state: schemas.StateCreate, db: Session = Depends(get_db)):
    db_state=models.State(
        name=state.name,
        default_valuta_id=state.default_valuta_id,
    )
    db.add(db_state)
    db.commit()
    db.refresh(db_state)
    return db_state


@app.post("/valuta_create")
def valuta_create(name: str, db: Session = Depends(get_db)):
    db_valuta=models.Valuta(
        name=name,
    )
    db.add(db_valuta)
    db.commit()
    db.refresh(db_valuta)
    return db_valuta

@app.post("/create_koshelka", response_model=schemas.KoshelkaCreate)
async def create_koshelka(
        koshelka: schemas.KoshelkaCreate, 
        db: Session = Depends(get_db),
        user = Depends(user_auth),  # noqa: inject user to check auth
    ):

    koshelka.user_id = user.id
    return crud.create_koshelka(db=db, koshelka=koshelka)


# Статистика
@app.get("/statistik")
def statistik(koshelka_id:int, db: Session = Depends(get_db)):
    db_expensed = db.query(models.Expenses).filter(
        koshelka_id == koshelka_id,
    ).all()
    db_income = db.query(models.Income).filter(
        koshelka_id == koshelka_id,
    ).all()
    stat = {
        "expens": db_expensed,
        "incom": db_income,
    }
    return stat


# Просмотр таблиц
@app.get("/users")
def users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.get("/states")
def states(db: Session = Depends(get_db)):
    return db.query(models.State).all()

@app.get("/valuts")
def valuts(db: Session = Depends(get_db)):
    return db.query(models.Valuta).all()

@app.get("/koshelki", response_model=schemas.KoshelkaCreate)
async def koshelki(
        koshelka: schemas.KoshelkaCreate, 
        db: Session = Depends(get_db),
        user = Depends(user_auth),  # noqa: inject user to check auth
    ):
    koshelka.user_id = user.id
    return db.query(models.Koshelka).all()

@app.get("/user_log")
def user_log(db: Session = Depends(get_db)):
    return db.query(models.UserLoggin).all()