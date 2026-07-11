from pathlib import Path

from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routes.api_router import api_router
from contextlib import asynccontextmanager
from .utilities.db import get_session, create_db_and_tables, engine
from .settings import settings
from .utilities.seed import seed_products, seed_superuser, seed_store
from sqlmodel import Session

RECORDINGS_DIR = Path(__file__).resolve().parent.parent / "recordings"
RECORDINGS_DIR.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup: Initialize before app starts
    get_session()
    create_db_and_tables()
    with Session(engine) as session:
        seed_store(session)
        seed_superuser(session)
        seed_products(session)
    yield  # This is crucial - it yields control back to FastAPI

    # Cleanup: Code after this will run when app shuts down
    # You can add cleanup code here if needed
    pass

app = FastAPI(
    title="Todo API",
    description="A simple ToDo API built with FastAPI and SQLModel",
    version="1.0.0",
    openapi_url="/api/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/recordings", StaticFiles(directory=RECORDINGS_DIR), name="recordings")


class Health(BaseModel): 
    message: str

@app.get("/", tags=["main"], response_model=Health, summary="Health Route", description="This is a health route for checking server status.")
def read_root():
    return {"message": "Hello World!"}

app.include_router(api_router)