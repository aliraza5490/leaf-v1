"""extend product and user for catalog management

Revision ID: a1b2c3d4e5f6
Revises: 38013969d66c
Create Date: 2026-06-24 13:30:00.000000

"""
from typing import Sequence, Union
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "38013969d66c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add catalog columns to product, store_id to user.

    Migrates product.image_url (single) -> product.images (JSON array string).
    """
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    product_columns = {c["name"] for c in inspector.get_columns("product")}
    user_columns = {c["name"] for c in inspector.get_columns("user")}

    # --- product table ---
    if "product" in inspector.get_table_names():
        if "image_url" in product_columns and "images" not in product_columns:
            op.add_column(
                "product",
                sa.Column("images", sa.VARCHAR(), nullable=False, server_default="[]"),
            )
            # Convert existing image_url values into a JSON array.
            conn.execute(
                sa.text(
                    'UPDATE "product" SET images = '
                    "CASE WHEN image_url IS NULL OR image_url = '' THEN '[]' "
                    "ELSE '[\"' || REPLACE(image_url, '\"', '\\\\\"') || '\"]' END"
                )
            )
            op.drop_column("product", "image_url")
        elif "images" not in product_columns:
            op.add_column(
                "product",
                sa.Column("images", sa.VARCHAR(), nullable=False, server_default="[]"),
            )

        if "sku" not in product_columns:
            op.add_column(
                "product",
                sa.Column("sku", sa.VARCHAR(length=100), nullable=False, server_default=""),
            )
        if "stock" not in product_columns:
            op.add_column(
                "product",
                sa.Column("stock", sa.INTEGER(), nullable=False, server_default="0"),
            )
        if "status" not in product_columns:
            op.add_column(
                "product",
                sa.Column("status", sa.VARCHAR(length=20), nullable=False, server_default="active"),
            )
        if "created_at" not in product_columns:
            op.add_column(
                "product",
                sa.Column("created_at", sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
            )
        if "updated_at" not in product_columns:
            op.add_column(
                "product",
                sa.Column("updated_at", sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
            )

    # --- user table ---
    if "user" in inspector.get_table_names() and "store_id" not in user_columns:
        op.add_column(
            "user",
            sa.Column("store_id", sa.VARCHAR(), nullable=False, server_default=""),
        )


def downgrade() -> None:
    """Revert catalog columns."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    product_columns = {c["name"] for c in inspector.get_columns("product")}
    user_columns = {c["name"] for c in inspector.get_columns("user")}

    if "user" in inspector.get_table_names() and "store_id" in user_columns:
        op.drop_column("user", "store_id")

    if "product" in inspector.get_table_names():
        if "updated_at" in product_columns:
            op.drop_column("product", "updated_at")
        if "created_at" in product_columns:
            op.drop_column("product", "created_at")
        if "status" in product_columns:
            op.drop_column("product", "status")
        if "stock" in product_columns:
            op.drop_column("product", "stock")
        if "sku" in product_columns:
            op.drop_column("product", "sku")
        if "images" in product_columns and "image_url" not in product_columns:
            # Restore image_url from the first image in the JSON array.
            op.add_column(
                "product",
                sa.Column("image_url", sa.VARCHAR(), nullable=False, server_default=""),
            )
            conn.execute(
                sa.text(
                    "UPDATE \"product\" SET image_url = "
                    "COALESCE((images::jsonb->>0), '')"
                )
            )
            op.drop_column("product", "images")
