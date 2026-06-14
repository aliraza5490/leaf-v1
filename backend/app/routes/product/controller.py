from fastapi import APIRouter, Depends
from typing import Union
from sqlmodel import Session
from ...models.product import ProductCreate, ProductUpdate
from ...utilities.db import get_session
from ...utilities.tags import Tags
from .service import (
    get_product,
    create_product,
    get_all_products,
    update_product,
    delete_product,
)

products_router = APIRouter(prefix="/products", tags=[Tags.products])


@products_router.post("/")
def create(product: ProductCreate, session: Session = Depends(get_session)):
    return create_product(product, session)


@products_router.get("/{product_id}")
def read(product_id: int, session: Session = Depends(get_session)):
    return get_product(product_id, session)


@products_router.get("/")
def read_all(
    store_id: str | None = None,
    q: str | None = None,
    session: Session = Depends(get_session),
):
    return get_all_products(session, store_id, q)


@products_router.put("/{product_id}")
def update(product_id: int, product: ProductUpdate, session: Session = Depends(get_session)):
    return update_product(product_id, product, session)


@products_router.delete("/{product_id}")
def delete(product_id: int, session: Session = Depends(get_session)):
    return delete_product(product_id, session)
