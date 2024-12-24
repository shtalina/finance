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
from fastapi.middleware.cors import CORSMiddleware
from seed_data import seed_data

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
CORSMiddleware,
allow_origins=origins,
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

@app.on_event("startup")
def startup_seed_data():
    db = SessionLocal()  # Создаём сессию напрямую
    seed_data(db)  # Передаём сессию в функцию seed_data
    db.close() 

@app.get("/")
def read_root():
    return {"hello":"World"}

@app.post("/registration")
def registration(user: schemas.UserCreate, db: Session = Depends(get_db)):   
    if crud.existence_email(db=db, email=user.email):
       raise HTTPException(status_code=400, detail="Email должен быть уникальным") 
    db_user=crud.create_user(db=db, user=user)
    valuta_id=crud.get_default_valuta(db=db, state_id=user.state_id)
    spec_for_koshelka=schemas.KoshelkaCreate(valuta_id=valuta_id,user_id=db_user.id)
    db_koshelka=crud.create_koshelka(db=db,koshelka=spec_for_koshelka)
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

@app.post("/create_koshelka", response_model=schemas.KoshelkaCreateWithoutUser)
async def create_koshelka(
        koshelka: schemas.KoshelkaCreateWithoutUser, 
        db: Session = Depends(get_db),
        user = Depends(user_auth),  # noqa: inject user to check auth
    ):
    spec_for_koshelka=schemas.KoshelkaCreate(valuta_id=koshelka.valuta_id,user_id=user.id)
    return crud.create_koshelka(db=db, koshelka=spec_for_koshelka)



# Статистика
@app.get("/statistik")
def statistik(
    koshelka_id:int, 
    db: Session = Depends(get_db),
    user = Depends(user_auth),
    ):
    koshelka_this_user = crud.koshelka_this_user(db=db, koshelka_id=koshelka_id, user_id=user.id)
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

@app.get("/koshelki")
async def koshelki(
        db: Session = Depends(get_db),
        user = Depends(user_auth), 
    ):
    return db.query(models.Koshelka).filter(models.Koshelka.user_id == user.id).all()


@app.post("/income_create")
def income_create(
    transaction: schemas.TransactionCreate, 
    db: Session = Depends(get_db),
    user = Depends(user_auth),
    ):
    koshelka_this_user = crud.koshelka_this_user(db=db, koshelka_id=transaction.koshelka_id, user_id=user.id)
    db_income=models.Income(
        category_income_id=transaction.category_id,
        koshelka_id=transaction.koshelka_id,
        count=transaction.count,
        created_at=datetime.datetime.now()
    )
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return True
    
@app.post("/expenses_create")
def expenses_create(
    transaction: schemas.TransactionCreate, 
    db: Session = Depends(get_db),
    user = Depends(user_auth),
    ):
    koshelka_this_user = crud.koshelka_this_user(db=db, koshelka_id=transaction.koshelka_id, user_id=user.id)
    db_expenses=models.Expenses(
        category_expenses_id=transaction.category_id,
        koshelka_id=transaction.koshelka_id,
        count=transaction.count,
        created_at=datetime.datetime.now()
    )
    db.add(db_expenses)
    db.commit()
    db.refresh(db_expenses)
    return True

@app.post("/category_income_create",response_model=schemas.CategoryCreate)
def category_income_create(
    income: schemas.CategoryCreate, 
    db: Session = Depends(get_db),
    user = Depends(user_auth),
    ):
    db_category_income=models.Category_income(
        category_name=income.category_name,
        user_id = user.id
    )
    db.add(db_category_income)
    db.commit()
    db.refresh(db_category_income)
    return db_category_income
 
@app.post("/category_expenses_create",response_model=schemas.CategoryCreate)
def category_expenses_create(
    expenses: schemas.CategoryCreate, 
    db: Session = Depends(get_db),
    user = Depends(user_auth),
    ):
    db_category_expenses=models.Category_expenses(
        category_name=expenses.category_name,
        user_id = user.id
    )
    db.add(db_category_expenses)
    db.commit()
    db.refresh(db_category_expenses)
    return db_category_expenses

# расходы авторизованного
@app.get("/category_expenses",response_model=list[schemas.Category])
async def category_expenses(
        db: Session = Depends(get_db),
        user = Depends(user_auth), 
    ):
    return db.query(models.Category_expenses).filter(models.Category_expenses.user_id == user.id).all()

# доходы авторизованного
@app.get("/category_income",response_model=list[schemas.Category])
async def category_income(
        db: Session = Depends(get_db),
        user = Depends(user_auth), 
    ):
    return db.query(models.Category_income).filter(models.Category_income.user_id == user.id).all()

@app.get("/balance")
def balance(
    koshelka_id:int,
    db: Session = Depends(get_db),
    user = Depends(user_auth)
    ):
    koshelka_this_user = crud.koshelka_this_user(db=db, koshelka_id=koshelka_id, user_id=user.id)
    valut=crud.valuta_name(db=db,koshelka_id=koshelka_id)
    incomes = db.query(models.Income.count).filter(models.Income.koshelka_id==koshelka_id).all()
    income_list=[income for (income,) in incomes]
    income_sum=sum(income_list)
    expenses = db.query(models.Expenses.count).filter(models.Expenses.koshelka_id==koshelka_id).all()
    expens_list=[expens for (expens,) in expenses]
    expens_sum=sum(expens_list)
    return {"cash":income_sum-expens_sum, "valut":valut}

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

@app.get("/user_log")
def user_log(db: Session = Depends(get_db)):
    return db.query(models.UserLoggin).all()

@app.get("/koshelki_free")
def koshelki_free(db: Session = Depends(get_db)):
    return db.query(models.Koshelka).all()

@app.get("/all_expenses")
def expenses(db: Session = Depends(get_db)):
    return db.query(models.Expenses).all()

@app.get("/all_income")
def income(db: Session = Depends(get_db)):
    return db.query(models.Income).all()

@app.get("/all_category_expenses")
def expenses(db: Session = Depends(get_db)):
    return db.query(models.Category_expenses).all()

@app.get("/all_category_income")
def income(db: Session = Depends(get_db)):
    return db.query(models.Category_income).all()
