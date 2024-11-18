from fastapi import APIRouter

from app.api.routes import diseases, items, login, users, utils, patients

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(items.router, prefix="/items", tags=["items"])

api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(diseases.router, prefix="/diseases", tags=["diseases"])
# api_router.include_router(appointments_router, prefix="/appointments", tags=["appointments"])

# api_router.include_router(inferences.router, prefix="/inferences", tags=["inferences"])