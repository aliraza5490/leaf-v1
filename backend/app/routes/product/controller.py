from fastapi import APIRouter, Depends
from sqlmodel import Session
from ...models.product import ProductCreate, ProductUpdate, ProductBulkCreate
from ...models.user import User
from ...utilities.db import get_session
from ...utilities.tags import Tags
from ...utilities.auth import get_user_from_token
from .service import (
    get_product,
    create_product,
    get_all_products,
    update_product,
    delete_product,
    bulk_create_products,
    get_categories,
)

products_router = APIRouter(prefix="/products", tags=[Tags.products])


@products_router.post("/")
def create(
    product: ProductCreate,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return create_product(product, user.store_id, session)


@products_router.post("/bulk")
def bulk_create(
    body: ProductBulkCreate,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return bulk_create_products(body.products, user.store_id, session)


@products_router.get("/categories")
def list_categories(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return get_categories(user.store_id, session)


@products_router.get("/{product_id}")
def read(
    product_id: int,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    product = get_product(product_id, session)
    if product.store_id != user.store_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found.")
    return product


@products_router.get("/")
def read_all(
    q: str | None = None,
    category: str | None = None,
    status: str | None = None,
    sort_field: str = "created_at",
    sort_dir: str = "desc",
    page: int = 1,
    page_size: int = 20,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return get_all_products(
        session,
        store_id=user.store_id,
        q=q,
        category=category,
        status=status,
        sort_field=sort_field,
        sort_dir=sort_dir,
        page=page,
        page_size=page_size,
    )


@products_router.put("/{product_id}")
def update(
    product_id: int,
    product: ProductUpdate,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return update_product(product_id, product, user.store_id, session)


@products_router.delete("/{product_id}")
def delete(
    product_id: int,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return delete_product(product_id, user.store_id, session)
