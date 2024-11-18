from sqlmodel import SQLModel, Session, create_engine, select

from app import crud
from app.core.config import settings
from app.models import Patient, PatientCreate, User, UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

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
        
    patients_data = [
        {
            "full_name": "John Doe",
            "date_of_birth": "1990-01-01",
        },
        {
            "full_name": "Jane Smith",
            "date_of_birth": "1985-05-15",
        },
        {
            "full_name": "Robert Brown",
            "date_of_birth": "2000-07-20",
        },
    ]

    for patient_data in patients_data:
        patient = session.exec(
            select(Patient).where(Patient.full_name == patient_data["full_name"],)
        ).first()
        if not patient:
            patient_in = PatientCreate(**patient_data)
            crud.create_patient(session=session, patient_create=patient_in)