import uuid
from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Depends, Query
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
    session: SessionDep, 
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
    patient_id: Optional[uuid.UUID] = Query(None, description="Filter diseases by patient ID"),
    sort_order: Optional[str] = Query("asc", enum=["asc", "desc"], description="Sort order by date")
) -> Any:
    """
    Retrieve diseases with optional filtering by patient ID and sorting by date.
    """
    statement = select(Disease)

    if patient_id:
        statement = statement.where(Disease.patient_id == patient_id)

    if sort_order == "desc":
        statement = statement.order_by(Disease.updated_at.desc())
    else:
        statement = statement.order_by(Disease.updated_at.asc())

    statement = statement.offset(skip).limit(limit)

    if patient_id:
        count = session.exec(select(func.count()).select_from(Disease).where(Disease.patient_id == patient_id)).one()
    else:
        count = session.exec(select(func.count()).select_from(Disease)).one()

    diseases = session.exec(statement).all()

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

    session.delete(disease)
    session.commit()
    return Message(message="Disease deleted successfully")
