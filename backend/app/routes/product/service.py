from fastapi import HTTPException
from typing import Union
from sqlmodel import Session, select
from ...models.product import Product, ProductCreate, ProductUpdate


def get_product(product_id: int, session: Session):
    product = session.exec(select(Product).where(Product.id == product_id)).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found.")
    return product


def create_product(product: ProductCreate, session: Session):
    product_data = Product(**product.model_dump())
    session.add(product_data)
    session.commit()
    session.refresh(product_data)
    return product_data


def get_all_products(session: Session, store_id: str | None = None, q: str | None = None):
    query = select(Product)
    if store_id:
        query = query.where(Product.store_id == store_id)
    if q:
        query = query.where(Product.name.ilike(f"%{q}%"))
    products = session.exec(query).all()
    return {"products": products}


def update_product(product_id: int, product: ProductUpdate, session: Session):
    product_data = session.exec(select(Product).where(Product.id == product_id)).first()
    if not product_data:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found.")

    update_data = product.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product_data, key, value)

    session.add(product_data)
    session.commit()
    session.refresh(product_data)
    return product_data


def delete_product(product_id: int, session: Session):
    product_data = session.exec(select(Product).where(Product.id == product_id)).first()
    if not product_data:
        raise HTTPException(status_code=404, detail=f"Product with id {product_id} not found.")
    session.delete(product_data)
    session.commit()
    return {"product_id": product_id}


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
