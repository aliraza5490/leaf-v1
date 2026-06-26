"""add admin rbac: role on user, store table, systemsetting table

Revision ID: d5e6f7g8h9i0
Revises: c4d5e6f7g8h9
Create Date: 2026-06-26 10:00:00.000000

"""
from typing import Sequence, Union
import sqlalchemy as sa
from alembic import op

revision: str = "d5e6f7g8h9i0"
down_revision: Union[str, None] = "c4d5e6f7g8h9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if "user" in inspector.get_table_names():
        user_columns = {c["name"] for c in inspector.get_columns("user")}
        if "role" not in user_columns:
            op.add_column(
                "user",
                sa.Column("role", sa.VARCHAR(length=20), nullable=False, server_default="user"),
            )

    if "store" not in inspector.get_table_names():
        op.create_table(
            "store",
            sa.Column("id", sa.VARCHAR(length=64), primary_key=True),
            sa.Column("name", sa.VARCHAR(length=200), nullable=False),
            sa.Column("owner_email", sa.VARCHAR(length=255), sa.ForeignKey("user.email"), nullable=True),
            sa.Column("status", sa.VARCHAR(length=20), nullable=False, server_default="active"),
            sa.Column("plan", sa.VARCHAR(length=20), nullable=False, server_default="free"),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
            sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        )

    if "systemsetting" not in inspector.get_table_names():
        op.create_table(
            "systemsetting",
            sa.Column("key", sa.VARCHAR(length=100), primary_key=True),
            sa.Column("value", sa.Text(), nullable=False, server_default=""),
            sa.Column("description", sa.Text(), nullable=False, server_default=""),
            sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        )


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if "systemsetting" in inspector.get_table_names():
        op.drop_table("systemsetting")

    if "store" in inspector.get_table_names():
        op.drop_table("store")

    if "user" in inspector.get_table_names():
        user_columns = {c["name"] for c in inspector.get_columns("user")}
        if "role" in user_columns:
            op.drop_column("user", "role")
