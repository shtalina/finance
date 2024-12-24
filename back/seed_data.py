from sqlalchemy.orm import Session
import models
from database import SessionLocal

def seed_data(db: Session):
    # Проверяем, существует ли уже запись в таблице Valuta
    if not db.query(models.Valuta).filter(models.Valuta.name == "Рубли").first():
        rub = models.Valuta(name="Рубли")
        db.add(rub)
        db.commit()
        db.refresh(rub)
    if not db.query(models.Valuta).filter(models.Valuta.name == "USD").first():
        usd = models.Valuta(name="USD")
        db.add(usd)
        db.commit()
        db.refresh(usd)
    if not db.query(models.Valuta).filter(models.Valuta.name == "EUR").first():
        eur = models.Valuta(name="EUR")
        db.add(eur)
        db.commit()
        db.refresh(eur)
    if not db.query(models.State).filter(models.State.name == "Россия").first():
        rus = models.State(name="Россия", default_valuta_id=1)
        db.add(rus)
        db.commit()
        db.refresh(rus)
    if not db.query(models.State).filter(models.State.name == "США").first():
        usa = models.State(name="США", default_valuta_id=2)
        db.add(usa)
        db.commit()
        db.refresh(usa)
    if not db.query(models.State).filter(models.State.name == "ФРГ").first():
        frg = models.State(name="ФРГ", default_valuta_id=3)
        db.add(frg)
        db.commit()
        db.refresh(frg)