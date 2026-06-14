from typing import Optional, List
from pydantic import StringConstraints
from sqlmodel import SQLModel, Field
from typing_extensions import Annotated


class ProductBase(SQLModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=200)]
    description: Annotated[str, StringConstraints(max_length=1000)] = ""
    price: float = Field(ge=0)
    image_url: str = ""
    url: str = ""
    category: Annotated[str, StringConstraints(max_length=100)] = ""
    tags: str = ""
    store_id: str = ""


class Product(ProductBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(SQLModel):
    name: Optional[Annotated[str, StringConstraints(min_length=1, max_length=200)]] = None
    description: Optional[Annotated[str, StringConstraints(max_length=1000)]] = None
    price: Optional[float] = Field(default=None, ge=0)
    image_url: Optional[str] = None
    url: Optional[str] = None
    category: Optional[Annotated[str, StringConstraints(max_length=100)]] = None
    tags: Optional[str] = None
    store_id: Optional[str] = None


class ProductRead(ProductBase):
    id: int
