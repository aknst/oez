from datetime import datetime
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
    Appointment,
    AppointmentUpdate,
    AppointmentsPublic,
    Message,
    Disease,
    DiseaseCreate,
    Patient,
    AppointmentCreate,
    AppointmentPublic
)

router = APIRouter()

def format_disease_last_diagnosis(appointment: Appointment):
    diagnosis = appointment.doctor_diagnosis or appointment.nlp_diagnosis or ""
    return diagnosis

@router.get("/{id}", response_model=AppointmentPublic)
def read_appointment(
    id: uuid.UUID,
    current_user: CurrentUser,
    session: SessionDep,
) -> Any:
    """
    Get appointment by ID.
    """
    appointment = session.get(Appointment, id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.post("/", response_model=AppointmentPublic)
def create_appointment(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    appointment_in: AppointmentCreate,
) -> Any:
    """
    Create new appointment record.
    """
    patient = session.get(Patient, appointment_in.patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    disease = session.get(Disease, appointment_in.disease_id)
    if not appointment_in.disease_id:
        disease_data = DiseaseCreate(
            patient_id=appointment_in.patient_id, 
            last_diagnosis=format_disease_last_diagnosis(appointment_in)
        )
        disease = Disease.model_validate(disease_data)
        session.add(disease)
        session.commit()
        session.refresh(disease)

        appointment_in.disease_id = disease.id
    else:
        disease = session.get(Disease, appointment_in.disease_id)
        if disease:
            disease.last_diagnosis = format_disease_last_diagnosis(appointment_in)
            disease.sqlmodel_update(disease)
            session.add(disease)
            session.commit()
            session.refresh(disease)


    doctor_id = current_user.id
    
    appointment = Appointment(
        patient_id=appointment_in.patient_id,
        disease_id=appointment_in.disease_id,
        doctor_id=doctor_id,
        created_at=datetime.now(),
        complaints=appointment_in.complaints,
        anamnesis=appointment_in.anamnesis,
        objective_status=appointment_in.objective_status,
        doctor_diagnosis=appointment_in.doctor_diagnosis,
        doctor_recommendations=appointment_in.doctor_recommendations,
        nlp_recommendations=appointment_in.nlp_recommendations,
        nlp_diagnosis=appointment_in.nlp_diagnosis,
    )
    session.add(appointment)
    session.commit()
    session.refresh(appointment)
    return appointment


@router.get("/", response_model=AppointmentsPublic)
def read_appointments(
    session: SessionDep, 
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 400,
    patient_id: Optional[uuid.UUID] = Query(None, description="Filter appointments by patient ID"),
    disease_id: Optional[uuid.UUID] = Query(None, description="Filter appointments by disease ID"),
    doctor_id: Optional[uuid.UUID] = Query(None, description="Filter appointments by doctor ID"),
    sort_order: Optional[str] = Query("asc", enum=["asc", "desc"], description="Sort order by appointment date"),
) -> Any:
    """
    Retrieve appointments with optional filtering by patient ID, disease ID, doctor ID, sorting by date,
    and an option to extend with related models (patient, disease, doctor).
    """
    statement = select(Appointment)

    if patient_id:
        statement = statement.where(Appointment.patient_id == patient_id)

    if disease_id:
        statement = statement.where(Appointment.disease_id == disease_id)

    if doctor_id:
        statement = statement.where(Appointment.doctor_id == doctor_id)

    if sort_order == "desc":
        statement = statement.order_by(Appointment.created_at.desc())
    else:
        statement = statement.order_by(Appointment.created_at.asc())

    statement = statement.offset(skip).limit(limit)

    count_query = select(func.count()).select_from(Appointment)
    if patient_id:
        count_query = count_query.where(Appointment.patient_id == patient_id)
    if disease_id:
        count_query = count_query.where(Appointment.disease_id == disease_id)
    if doctor_id:
        count_query = count_query.where(Appointment.doctor_id == doctor_id)

    count = session.exec(count_query).one()

    appointments = session.exec(statement).all()

    return AppointmentsPublic(data=appointments, count=count)


@router.put("/{id}", response_model=AppointmentPublic)
def update_appointment(
    *,
    id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
    appointment_update: AppointmentUpdate,
) -> Any:
    """
    Update an existing appointment record by ID.
    """
    appointment = session.get(Appointment, id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    for field, value in appointment_update.model_dump(exclude_unset=True).items():
        setattr(appointment, field, value)

    if appointment_update.disease_id and appointment_update.disease_id != appointment.disease_id:
        disease = session.get(Disease, appointment_update.disease_id)
        if not disease:
            raise HTTPException(status_code=404, detail="Disease not found")
        appointment.disease_id = disease.id

    if appointment_update.disease_id:
        disease = session.get(Disease, appointment_update.disease_id)
        disease.last_diagnosis = format_disease_last_diagnosis(appointment)
        disease.sqlmodel_update(disease)
        session.add(disease)
        session.commit()
        session.refresh(disease)

    session.add(appointment)
    session.commit()
    session.refresh(appointment)

    return appointment

@router.delete("/{id}", response_model=Message)
def delete_appointment(
    *,
    id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Delete an appointment record.
    """
    appointment = session.get(Appointment, id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    session.delete(appointment)
    session.commit()
    return Message(message="Appointment deleted successfully")
