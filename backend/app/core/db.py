from datetime import date
import os
from typing import List
from sqlmodel import SQLModel, Session, create_engine, select
import csv

from app import crud
from app.core.config import settings
from app.models import Gender, Patient, PatientBase, PatientCreate, Recommendations, User, UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))



def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    SQLModel.metadata.create_all(engine)

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.create_user(session=session, user_create=user_in)
        
    patients: List[PatientCreate] = [
        PatientCreate(full_name="Иван Иванов", birth_date=date(1990, 1, 15), gender=Gender.male),
        PatientCreate(full_name="Алексей Петров", birth_date=date(1985, 5, 20), gender=Gender.male),
        PatientCreate(full_name="Анна Смирнова", birth_date=date(1993, 8, 10), gender=Gender.female),
        PatientCreate(full_name="Екатерина Фёдорова", birth_date=date(1998, 3, 25), gender=Gender.female),
    ]

    for patient_in in patients:
        patient = session.exec(
            select(Patient).where(Patient.full_name == patient_in.full_name,)
        ).first()
        if not patient:
            crud.create_patient(session=session, patient_create=patient_in)
    
    base_dir = os.path.dirname(os.path.dirname(__file__))
    csv_path = os.path.join(base_dir, 'ai', 'gpt.csv')
    
    with open(csv_path, 'r', encoding='utf-8') as file:
        for line in file:
            line = line.strip() 
            if line:
                try:
                    label, data = line.split('$', 1)
                    label = label.replace('"', '')
                    data = data.replace("\\n", "\n")

                    existing_recommendation = session.exec(
                        select(Recommendations).where(Recommendations.label == label,)
                    ).first()
                    if existing_recommendation:
                        continue

                    recommendation = Recommendations(
                        label=label,
                        data=data
                    )
                    
                    session.add(recommendation)
                    session.commit()
                    session.refresh(recommendation)
                except ValueError:
                    continue
                    