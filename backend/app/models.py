from datetime import date, datetime, timezone
from enum import Enum
import uuid

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

# Users section
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)

class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)

class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)

class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)

class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)

class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    appointments: list["Appointment"] = Relationship(back_populates="doctor")

class UserPublic(UserBase):
    id: uuid.UUID

class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int

# Tokens and Authentication
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(SQLModel):
    sub: str | None = None

class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)

# Appointments section
class AppointmentBase(SQLModel):
    complaints: str | None = None
    anamnesis: str | None = None
    objective_status: str | None = None
    doctor_diagnosis: str | None = None
    doctor_recommendations: str | None = None
    nlp_recommendations: str | None = None
    nlp_diagnosis: str | None = None

class AppointmentInference(SQLModel):
    complaints: str | None = None
    anamnesis: str | None = None
    objective_status: str | None = None
    patient_id: uuid.UUID | None = None
    disease_id: uuid.UUID | None = None

class InferenceResult(SQLModel):
    result: str

class AppointmentCreate(AppointmentBase):
    patient_id: uuid.UUID | None = Field(foreign_key="patient.id", nullable=True)
    disease_id: uuid.UUID | None = Field(foreign_key="disease.id", nullable=False)

class AppointmentUpdate(AppointmentBase):
    disease_id: uuid.UUID | None = None

class Appointment(AppointmentBase, table=True):
    created_at: datetime = Field(default=datetime.now(timezone.utc), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    patient_id: uuid.UUID = Field(foreign_key="patient.id", nullable=True, ondelete="CASCADE")
    disease_id: uuid.UUID = Field(foreign_key="disease.id", nullable=True, ondelete="CASCADE")
    doctor_id: uuid.UUID = Field(foreign_key="user.id", nullable=True, ondelete="CASCADE")

    patient: "Patient" = Relationship(back_populates="appointments")
    disease: "Disease" = Relationship(back_populates="appointments")
    doctor: "User" = Relationship(back_populates="appointments")

class AppointmentPublic(AppointmentBase):
    id: uuid.UUID
    patient_id: uuid.UUID | None = None
    disease_id: uuid.UUID | None = None
    doctor_id: uuid.UUID| None = None
    created_at: datetime

class AppointmentPublicWithPatientWithDoctor(AppointmentPublic):
    patient: "PatientPublic"
    doctor: "UserPublic"

class AppointmentsPublic(SQLModel):
    data: list[AppointmentPublic]
    count: int

# Patients section
class Gender(str, Enum):
    male = "male"
    female = "female"

class PatientBase(SQLModel):
    full_name: str = Field(max_length=255)
    birth_date: date | None = None
    gender: Gender

class PatientCreate(PatientBase):
    pass

class PatientUpdate(PatientBase):
    full_name: str | None = None
    birth_date: date | None = None

class Patient(PatientBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    appointments: list["Appointment"] = Relationship(back_populates="patient")
    diseases: list["Disease"] = Relationship(back_populates="patient")

class PatientPublic(PatientBase):
    id: uuid.UUID

class PatientsPublic(SQLModel):
    data: list[PatientPublic]
    count: int

# Diseases section
class DiseaseBase(SQLModel):
    last_diagnosis: str | None = None

class DiseaseCreate(DiseaseBase):
    patient_id: uuid.UUID = Field(foreign_key="patient.id", nullable=False)
    last_diagnosis: str | None = None

class DiseaseUpdate(SQLModel):
    patient_id: uuid.UUID | None = None
    last_diagnosis: str | None = None

class Disease(DiseaseBase, table=True):
    created_at: datetime = Field(default=datetime.now(timezone.utc), nullable=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), nullable=False)
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    patient_id: uuid.UUID = Field(foreign_key="patient.id", nullable=False, ondelete="CASCADE")
    patient: "Patient" = Relationship(back_populates="diseases")
    appointments: list["Appointment"] = Relationship(back_populates="disease")

class DiseasePublic(DiseaseBase):
    id: uuid.UUID
    patient_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

class DiseasesPublic(SQLModel):
    data: list[DiseasePublic]
    count: int

# Generic Messages and Results
class Message(SQLModel):
    message: str

# Recommendations
class RecommendationsBase(SQLModel):
    label: str
    data: str

class Recommendations(RecommendationsBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    label: str
    data: str

class RecommendationsPublic(RecommendationsBase):
    pass
