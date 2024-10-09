from fastapi import Depends, FastAPI, HTTPException

from database import SessionLocal, engine
from sqlalchemy.orm import Session
from sqlalchemy import select

import models
import schemas

from helpers import generate_token
import datetime

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
    user_old= db.query(models.User).filter(models.User.email == user.email).first()
    if user_old:
        raise HTTPException(status_code=400, detail="Email должен быть уникальным")

    try:
        fake_hashed_password=user.password + "soli"
        db_user=models.User(
            email=user.email,
            username=user.username,
            password=fake_hashed_password,
            state_id=user.state_id
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        db_koshelka=models.Koshelka(
            valuta_id = db.execute(select(models.State).where(models.State.id == db_user.state_id)).scalar_one_or_none().default_valuta_id,
            user_id=db_user.id
        )
        db.add(db_koshelka)
        db.commit()
        return db_user
    except:
        raise HTTPException(status_code=400, detail="Что-то пошло не так")
    
    # user = db.query(models.User).filter(models.User.email == email).first()

    # return {'status':True}

@app.get("/users")
def users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.post("/auth")
def auth(email: str, password: str, db: Session = Depends(get_db)):
    now_time=datetime.datetime.now
    later_time=now_time-datetime.timedelta(minutes=5)
    limit = 5

    db_user_log=models.UserLoggin(
            email=email,
            created_at=now_time
        )
    db.add(db_user_log)
    db.commit()

    user_logs = db.query(models.UserLoggin).filter(
        models.UserLoggin.email == email,
        models.UserLoggin.create_at >= later_time,
    ).all()
    
    if len(user_logs) >=limit:
        raise HTTPException(status_code=404, detail="Использованы все попытки")

    fake_hashed_password=password + "soli"
    user = db.query(models.User).filter(
        models.User.email == email,
        models.User.password == fake_hashed_password,
    ).first()

    if not user:
        
        raise HTTPException(status_code=400, detail="Пользователь не был найден")

    new_token=generate_token()
    user.token=new_token
    db.commit()
    db.refresh(user)

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
def restore_account(
        restore_token: str, 
        new_password: str, 
        new_password_confirm: str, 
        db: Session = Depends(get_db),
    ):
    user = db.query(models.User).filter(
        models.User.restore_token == restore_token,
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail='User not found')
    
    if new_password != new_password_confirm:
        raise HTTPException(status_code=400, detail='Пароли не совпадают')

    fake_hashed_password = new_password + "soli"
    user.password = fake_hashed_password
    user.restore_token = None

    db.commit()
    db.refresh(user)

    return {
        'status': True,
    }

@app.post("/states_create")
def states_create(name: str, default_valuta_id: int, db: Session = Depends(get_db)):
    db_state=models.State(
        name=name,
        default_valuta_id=default_valuta_id,
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





@app.get("/states")
def states(db: Session = Depends(get_db)):
    return db.query(models.State).all()

@app.get("/valuts")
def valuts(db: Session = Depends(get_db)):
    return db.query(models.Valuta).all()


@app.get("/koshelki")
def koshelki(db: Session = Depends(get_db)):
    return db.query(models.Koshelka).all()

@app.get("/user_log")
def user_log(db: Session = Depends(get_db)):
    return db.query(models.UserLoggin).all()
