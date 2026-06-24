import json
from datetime import datetime
from fastapi import HTTPException
from sqlmodel import Session, select, func, or_

from ...models.product import (
    Product,
    ProductCreate,
    ProductUpdate,
)
from ...models.user import User

VALID_SORT_FIELDS = {"name", "price", "stock", "created_at"}
VALID_SORT_DIRS = {"asc", "desc"}
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


def first_image(images_json: str | None) -> str:
    """Parse a JSON-encoded images array and return the first URL, or ''."""
    if not images_json:
        return ""
    try:
        images = json.loads(images_json)
        return images[0] if images else ""
    except (json.JSONDecodeError, TypeError, IndexError):
        return ""


def _to_read_dict(product: Product) -> dict:
    try:
        images = json.loads(product.images) if product.images else []
    except (json.JSONDecodeError, TypeError):
        images = []
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "images": images,
        "url": product.url,
        "category": product.category,
        "tags": [t for t in product.tags.split(",") if t] if product.tags else [],
        "store_id": product.store_id,
        "sku": product.sku,
        "stock": product.stock,
        "status": product.status,
        "created_at": product.created_at.isoformat() if product.created_at else None,
        "updated_at": product.updated_at.isoformat() if product.updated_at else None,
    }


def get_product(product_id: int, session: Session) -> Product:
    product = session.exec(select(Product).where(Product.id == product_id)).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found.")
    return product


def get_product_for_store(product_id: int, store_id: str, session: Session) -> Product:
    product = session.exec(
        select(Product).where(Product.id == product_id, Product.store_id == store_id)
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found.")
    return product


def create_product(product: ProductCreate, store_id: str, session: Session) -> dict:
    product_data = Product(**product.model_dump())
    product_data.store_id = store_id
    if not product_data.images:
        product_data.images = "[]"
    session.add(product_data)
    session.commit()
    session.refresh(product_data)
    return _to_read_dict(product_data)


def get_all_products(
    session: Session,
    store_id: str,
    q: str | None = None,
    category: str | None = None,
    status: str | None = None,
    sort_field: str = "created_at",
    sort_dir: str = "desc",
    page: int = 1,
    page_size: int = DEFAULT_PAGE_SIZE,
) -> dict:
    if sort_field not in VALID_SORT_FIELDS:
        sort_field = "created_at"
    if sort_dir not in VALID_SORT_DIRS:
        sort_dir = "desc"
    page = max(1, page)
    page_size = max(1, min(page_size, MAX_PAGE_SIZE))

    query = select(Product).where(Product.store_id == store_id)

    if q:
        query = query.where(
            or_(
                Product.name.ilike(f"%{q}%"),
                Product.description.ilike(f"%{q}%"),
                Product.sku.ilike(f"%{q}%"),
                Product.tags.ilike(f"%{q}%"),
            )
        )
    if category and category != "all":
        query = query.where(Product.category == category)
    if status and status != "all":
        query = query.where(Product.status == status)

    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    sort_column = getattr(Product, sort_field)
    query = query.order_by(sort_column.desc() if sort_dir == "desc" else sort_column.asc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    products = session.exec(query).all()
    return {
        "products": [_to_read_dict(p) for p in products],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


def update_product(
    product_id: int, product: ProductUpdate, store_id: str, session: Session
) -> dict:
    product_data = get_product_for_store(product_id, store_id, session)

    update_data = product.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product_data, key, value)

    product_data.updated_at = datetime.utcnow()

    session.add(product_data)
    session.commit()
    session.refresh(product_data)
    return _to_read_dict(product_data)


def delete_product(product_id: int, store_id: str, session: Session) -> dict:
    product_data = get_product_for_store(product_id, store_id, session)
    session.delete(product_data)
    session.commit()
    return {"product_id": product_id}


def bulk_create_products(
    products: list[ProductCreate], store_id: str, session: Session
) -> dict:
    created = []
    for product in products:
        product_data = Product(**product.model_dump())
        product_data.store_id = store_id
        if not product_data.images:
            product_data.images = "[]"
        session.add(product_data)
        created.append(product_data)
    session.commit()
    for p in created:
        session.refresh(p)
    return {"products": [_to_read_dict(p) for p in created], "count": len(created)}


def get_categories(store_id: str, session: Session) -> dict:
    rows = session.exec(
        select(Product.category, func.count(Product.id))
        .where(Product.store_id == store_id, Product.category != "")
        .group_by(Product.category)
    ).all()
    return {
        "categories": [
            {"id": name, "name": name, "productCount": count}
            for name, count in rows
        ]
    }


def search_products(query: str, session: Session, store_id: str | None = None, limit: int = 5):
    search_query = select(Product).where(
        (Product.name.ilike(f"%{query}%")) |
        (Product.description.ilike(f"%{query}%")) |
        (Product.category.ilike(f"%{query}%")) |
        (Product.tags.ilike(f"%{query}%"))
    )
    if store_id:
        search_query = search_query.where(Product.store_id == store_id)
    search_query = search_query.limit(limit)
    products = session.exec(search_query).all()
    return products
