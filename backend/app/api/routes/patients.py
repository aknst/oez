import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app import crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
)
from app.models import (
    Message,
    Patient,
    PatientCreate,
    PatientPublic,
    PatientUpdate,
    PatientsPublic,
)
from app.utils import generate_new_account_email, send_email



router = APIRouter()


@router.get("/", response_model=PatientsPublic)
def read_patients(
    session: SessionDep, current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve patients.
    """
    statement = select(Patient).offset(skip).limit(limit)
    count = session.exec(select(func.count()).select_from(Patient)).one()
    patients = session.exec(statement).all()

    return PatientsPublic(data=patients, count=count)


@router.get("/{id}", response_model=PatientPublic)
def read_patient(
    id: uuid.UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> Any:
    """
    Get patient by ID.
    """
    patient = session.get(Patient, id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.post("/", response_model=PatientPublic)
def create_patient(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    patient_in: PatientCreate,
) -> Any:
    """
    Create new patient.
    """
    patient = Patient.model_validate(patient_in)
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return patient


@router.put("/{id}", response_model=PatientPublic)
def update_patient(
    *,
    id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
    patient_in: PatientUpdate,
) -> Any:
    """
    Update a patient.
    """
    patient = session.get(Patient, id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    update_data = patient_in.model_dump(exclude_unset=True)
    patient.sqlmodel_update(update_data)
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return patient


@router.delete("/{id}", response_model=Message)
def delete_patient(
    *,
    id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Delete a patient.
    """
    patient = session.get(Patient, id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    session.delete(patient)
    session.commit()
    return Message(message="Patient deleted successfully")
