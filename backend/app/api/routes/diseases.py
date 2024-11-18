import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import func, select

from app import crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
)
from app.models import (
    Message,
    Disease,
    DiseaseCreate,
    DiseasePublic,
    DiseaseUpdate,
    DiseasesPublic,
    Patient,
)

router = APIRouter()


@router.get("/", response_model=DiseasesPublic)
def read_diseases(
    session: SessionDep, current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve diseases.
    """
    if current_user.is_superuser:
        statement = select(Disease).offset(skip).limit(limit)
        count = session.exec(select(func.count()).select_from(Disease)).one()
        diseases = session.exec(statement).all()
    else:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    return DiseasesPublic(data=diseases, count=count)


@router.get("/{id}", response_model=DiseasePublic)
def read_disease(
    id: uuid.UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> Any:
    """
    Get disease by ID.
    """
    disease = session.get(Disease, id)
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")
    return disease


@router.post("/", response_model=DiseasePublic)
def create_disease(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    disease_in: DiseaseCreate,
) -> Any:
    """
    Create new disease record.
    """
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    patient = session.get(Patient, disease_in.patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    disease = Disease.model_validate(disease_in)
    session.add(disease)
    session.commit()
    session.refresh(disease)
    return disease


@router.put("/{id}", response_model=DiseasePublic)
def update_disease(
    *,
    id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
    disease_in: DiseaseUpdate,
) -> Any:
    """
    Update a disease record.
    """
    disease = session.get(Disease, id)
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    update_data = disease_in.model_dump(exclude_unset=True)
    disease.sqlmodel_update(update_data)
    session.add(disease)
    session.commit()
    session.refresh(disease)
    return disease


@router.delete("/{id}", response_model=Message)
def delete_disease(
    *,
    id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Delete a disease record.
    """
    disease = session.get(Disease, id)
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    session.delete(disease)
    session.commit()
    return Message(message="Disease deleted successfully")
