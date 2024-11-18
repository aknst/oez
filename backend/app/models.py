from datetime import date, datetime
from typing import Optional
import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)

    appointments: list["Appointment"] = Relationship(back_populates="doctor")


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# Shared properties
class AppointmentBase(SQLModel):
    appointment_date: datetime = Field(default_factory=datetime.now)
    complaints: Optional[str] = None  # Жалобы
    anamnesis: Optional[str] = None  # Анамнез заболевания
    disease_day: Optional[int] = None  # День заболевания
    objective_status: Optional[str] = None  # Объективный статус
    doctor_diagnosis: Optional[str] = None  # Диагноз врача
    doctor_recommendations: Optional[str] = None  # Рекомендации врача
    nlp_recommendations: Optional[str] = None  # Рекомендации по лечению
    nlp_diagnosis: Optional[str] = None  # Диагноз от NLP


# Properties to receive via API on creation
class AppointmentCreate(AppointmentBase):
    patient_id: uuid.UUID = Field(foreign_key="patient.id", nullable=False)
    disease_id: uuid.UUID = Field(foreign_key="disease.id", nullable=False)
    doctor_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)


# Properties to receive via API on update, all are optional
class AppointmentUpdate(AppointmentBase):
    patient_id: Optional[uuid.UUID] = None
    disease_id: Optional[uuid.UUID] = None
    doctor_id: Optional[uuid.UUID] = None


# Database model, database table inferred from class name
class Appointment(AppointmentBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    patient_id: uuid.UUID = Field(foreign_key="patient.id", nullable=False, ondelete="CASCADE")
    disease_id: uuid.UUID = Field(foreign_key="disease.id", nullable=False, ondelete="CASCADE")
    doctor_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    
    patient: "Patient" = Relationship(back_populates="appointments")
    disease: "Disease" = Relationship(back_populates="appointments")
    doctor: "User" = Relationship(back_populates="appointments")


# Properties to return via API, id is always required
class AppointmentPublic(AppointmentBase):
    id: uuid.UUID
    patient_id: uuid.UUID
    disease_id: uuid.UUID
    doctor_id: uuid.UUID


# List of Appointments for API response
class AppointmentsPublic(SQLModel):
    data: list[AppointmentPublic]
    count: int


# Shared properties for Patient
class PatientBase(SQLModel):
    full_name: str = Field(max_length=255, description="Полное имя пациента")
    birth_date: Optional[date] = Field(default=None, description="Дата рождения пациента")


# Properties to receive via API on creation
class PatientCreate(PatientBase):
    pass


# Properties to receive via API on update, all are optional
class PatientUpdate(PatientBase):
    full_name: Optional[str] = Field(default=None, max_length=255)
    birth_date: Optional[date] = None


class Patient(PatientBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    appointments: list["Appointment"] = Relationship(back_populates="patient")
    diseases: list["Disease"] = Relationship(back_populates="patient")  # Добавлено отношение


# Properties to return via API
class PatientPublic(PatientBase):
    id: uuid.UUID


# List of Patients for API response
class PatientsPublic(SQLModel):
    data: list[PatientPublic]
    count: int


# Shared properties for Disease
class DiseaseBase(SQLModel):
    created_at: datetime = Field(default_factory=datetime.now, description="Дата создания записи о болезни")


# Properties to receive via API on creation
class DiseaseCreate(DiseaseBase):
    patient_id: uuid.UUID = Field(foreign_key="patient.id", nullable=False)


# Properties to receive via API on update, all are optional
class DiseaseUpdate(SQLModel):
    patient_id: Optional[uuid.UUID] = None


# Database model, database table inferred from class name
class Disease(DiseaseBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    patient_id: uuid.UUID = Field(foreign_key="patient.id", nullable=False, ondelete="CASCADE")

    patient: "Patient" = Relationship(back_populates="diseases")
    appointments: list["Appointment"] = Relationship(back_populates="disease")


# Properties to return via API
class DiseasePublic(DiseaseBase):
    id: uuid.UUID
    patient_id: uuid.UUID


# List of Diseases for API response
class DiseasesPublic(SQLModel):
    data: list[DiseasePublic]
    count: int