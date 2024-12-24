from sqlalchemy.orm import Session
from sqlalchemy import select
import models
import schemas
from fastapi import Depends, FastAPI, HTTPException
import datetime
from helpers import generate_token


def fake_hashed_password(password:str):
    fake_hashed_password = password + "soli"
    return fake_hashed_password

def koshelka_this_user(db:Session,koshelka_id:int,user_id:int):
    koshelka_this_user = db.query(models.Koshelka).filter(
        models.Koshelka.user_id == user_id,
        models.Koshelka.id == koshelka_id
    ).first()
    if not koshelka_this_user:
        raise HTTPException(status_code=400, detail='Не ваш кошелёк')
    return True

def valuta_name(db:Session,koshelka_id:int):
    id_valuta=db.query(models.Koshelka).filter(models.Koshelka.id==koshelka_id).first().valuta_id
    name_valuta=db.query(models.Valuta).filter(models.Valuta.id==id_valuta).first().name
    return name_valuta


def existence_email(db: Session, email: str):
    user_old = db.query(models.User).filter(models.User.email == email).first()
    return user_old

def create_user(db: Session, user: schemas.UserCreate):
    try:
        fake_password=fake_hashed_password(user.password)
        db_user=models.User(
            email=user.email,
            username=user.username,
            password=fake_password,
            state_id=user.state_id,
            token=generate_token()
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except:
        raise HTTPException(status_code=400, detail="ошибка при регистрации пользователя")

def get_default_valuta(db:Session,state_id: int):
    try:
        valuta_id = db.execute(select(models.State).where(models.State.id == state_id)).scalar_one_or_none().default_valuta_id
        return valuta_id
    except:
        raise HTTPException(status_code=400, detail="ошибка при определении дефолтной валюты")

def exists_valuta(db:Session, id:int):
    valuta = db.query(models.Valuta).filter(
        models.Valuta.id == id,
    ).first()
    if not valuta:
        raise HTTPException(status_code=400, detail='Нет такой валюты')
    return True 

def create_koshelka(db:Session, koshelka: schemas.KoshelkaCreate):
    exists=exists_valuta(db=db, id=koshelka.valuta_id)
    db_koshelka=models.Koshelka(
    valuta_id = koshelka.valuta_id,
    user_id = koshelka.user_id,
    )
    db.add(db_koshelka)
    db.commit()
    db.refresh(db_koshelka)
    return db_koshelka

def create_user_loggin(db: Session, user_log: schemas.UserBase):
    # return True
    try:
        db_user_log=models.UserLoggin(
            email=user_log.email,
            created_at=datetime.datetime.now()
        )
        db.add(db_user_log)
        db.commit()
        db.refresh(db_user_log)
        return db_user_log
    except:
        raise HTTPException(status_code=400, detail="ошибка при создании записи о попытки входа")

def user_logs_by_time(db:Session, time_min: int, email:str):
    try:
        later_time=datetime.datetime.now()-datetime.timedelta(minutes=time_min)
        user_logs = db.query(models.UserLoggin).filter(
            models.UserLoggin.email == email,
            models.UserLoggin.created_at >= later_time,
        ).all()
        return user_logs
    except:
        raise HTTPException(status_code=400, detail="ошибка при получении информации о попытках входа")

def auth(db: Session,user:schemas.authUser):
    try:
        hashed_password = fake_hashed_password(user.password)
        user_in_db = db.query(models.User).filter(
            models.User.email == user.email,
            models.User.password == hashed_password,
        ).first()
        if not user_in_db:
            raise HTTPException(status_code=400, detail="Пользователь не был найден")
        new_token = generate_token()
        user_in_db.token = new_token
        db.commit()
        db.refresh(user_in_db)
        return user_in_db
    except:
        raise HTTPException(status_code=400, detail="ошибка при авторизации")
        
