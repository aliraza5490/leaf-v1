import json
from datetime import datetime
from typing import Optional, List
from pydantic import StringConstraints, field_validator
from sqlmodel import SQLModel, Field
from typing_extensions import Annotated


VALID_STATUSES = ("active", "draft", "archived")


class ProductBase(SQLModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=200)]
    description: Annotated[str, StringConstraints(max_length=1000)] = ""
    price: float = Field(ge=0)
    images: str = "[]"
    url: str = ""
    category: Annotated[str, StringConstraints(max_length=100)] = ""
    tags: str = ""
    store_id: str = ""
    sku: Annotated[str, StringConstraints(max_length=100)] = ""
    stock: int = Field(default=0, ge=0)
    status: Annotated[str, StringConstraints(max_length=20)] = "active"

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in VALID_STATUSES:
            raise ValueError(f"status must be one of {VALID_STATUSES}")
        return v

    @field_validator("images")
    @classmethod
    def validate_images(cls, v: str) -> str:
        if not v:
            return "[]"
        try:
            parsed = json.loads(v)
        except (json.JSONDecodeError, TypeError) as e:
            raise ValueError("images must be a JSON-encoded array of strings") from e
        if not isinstance(parsed, list) or not all(
            isinstance(i, str) for i in parsed
        ):
            raise ValueError("images must be a JSON-encoded array of strings")
        return v


class Product(ProductBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(SQLModel):
    name: Optional[Annotated[str, StringConstraints(min_length=1, max_length=200)]] = None
    description: Optional[Annotated[str, StringConstraints(max_length=1000)]] = None
    price: Optional[float] = Field(default=None, ge=0)
    images: Optional[str] = None
    url: Optional[str] = None
    category: Optional[Annotated[str, StringConstraints(max_length=100)]] = None
    tags: Optional[str] = None
    store_id: Optional[str] = None
    sku: Optional[Annotated[str, StringConstraints(max_length=100)]] = None
    stock: Optional[int] = Field(default=None, ge=0)
    status: Optional[Annotated[str, StringConstraints(max_length=20)]] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_STATUSES:
            raise ValueError(f"status must be one of {VALID_STATUSES}")
        return v

    @field_validator("images")
    @classmethod
    def validate_images(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return v
        try:
            parsed = json.loads(v)
        except (json.JSONDecodeError, TypeError) as e:
            raise ValueError("images must be a JSON-encoded array of strings") from e
        if not isinstance(parsed, list) or not all(
            isinstance(i, str) for i in parsed
        ):
            raise ValueError("images must be a JSON-encoded array of strings")
        return v


class ProductRead(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime


class ProductBulkCreate(SQLModel):
    products: List[ProductCreate]
