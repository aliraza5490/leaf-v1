from sqlmodel import create_engine, Session, SQLModel

from ..settings import settings

# SQLModel setup
DATABASE_URL = settings.SQLALCHEMY_DATABASE_URI
engine = create_engine(str(DATABASE_URL), echo=True)

# Create tables on startup
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Database dependency
def get_session():
    with Session(engine) as session:
        yield session

def verify_store_exists(store_id: int, session: Session) -> None:
    from ..models.store import Store
    from fastapi import HTTPException, status
    store = session.get(Store, store_id)
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Store with id {store_id} not found"
        )

