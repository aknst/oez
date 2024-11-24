from datetime import datetime

from app.ai.bert import get_bert_result
from app.ai.ensemble import get_ensemble_result
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import func, select

from app import crud
from app.api.deps import (
    CurrentUser,
    SessionDep,
)
from app.models import (
    AppointmentInference,
    InferenceResult,
    Patient,
    Recommendations,
)

router = APIRouter()


def calculate_age(birthdate: datetime) -> int:
    """
    Функция для вычисления возраста пациента по дате рождения.
    """
    today = datetime.today()
    age = today.year - birthdate.year
    if today.month < birthdate.month or (today.month == birthdate.month and today.day < birthdate.day):
        age -= 1
    return age


@router.post("/{model}/inference", response_model=InferenceResult)
def model_inference(
    *,
    model: str,
    session: SessionDep,
    current_user: CurrentUser,
    request: AppointmentInference
):
    """
    Инференс текста с использованием указанной модели.
    """
    result = ""
    if model == "bert":
        patient = session.get(Patient, request.patient_id)
    
        if patient is None:
            patient_age = 20
            patient_gender = "male"
        else:
            patient_age = calculate_age(patient.birth_date) if patient.birth_date else 20
            patient_gender = patient.gender

        patient_gender = "Мужчина" if patient_gender == "male" else "Женщина"

        prompt = f"{patient_gender}, {patient_age} лет, {request.complaints} {request.anamnesis} {request.objective_status}"
        
        result = get_bert_result(prompt.lower().strip())
    elif model == "ensemble":
        prompt = f"{request.complaints} {request.anamnesis} {request.objective_status}"
        result = get_ensemble_result(prompt.lower())
    else:
        raise HTTPException(status_code=400, detail=f"Модель '{model}' не поддерживается")

    return InferenceResult(result=result)


@router.get("/gpt-static/inference", response_model=InferenceResult)
def read_recs(*,
    session: SessionDep,
    current_user: CurrentUser,
    label: str = Query(..., description="Filter recommendation by label")):
    statement = select(Recommendations).where(Recommendations.label == label).limit(1)
    result = session.exec(statement).first()
    if result:
        return InferenceResult(result=result.data)
    else:
        return InferenceResult(result="")