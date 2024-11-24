from fastapi import APIRouter

from app.api.routes import appointments, diseases, login, models, users, utils, patients

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])

api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(diseases.router, prefix="/diseases", tags=["diseases"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])

api_router.include_router(models.router, prefix="/models", tags=["models"])