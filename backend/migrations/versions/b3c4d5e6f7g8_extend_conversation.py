"""extend conversation and chatmessage

Revision ID: b3c4d5e6f7g8
Revises: a1b2c3d4e5f6
Create Date: 2026-06-25 10:00:00.000000

"""
from typing import Sequence, Union
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "b3c4d5e6f7g8"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add conversation metadata and chatmessage sender/read columns.

    Mirrors the idempotent inspector pattern used by a1b2c3d4e5f6 so the
    migration is safe to re-run on partially-migrated databases.
    """
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if "conversation" not in inspector.get_table_names():
        return

    conversation_columns = {c["name"] for c in inspector.get_columns("conversation")}
    chatmessage_columns = (
        {c["name"] for c in inspector.get_columns("chatmessage")}
        if "chatmessage" in inspector.get_table_names()
        else set()
    )

    # --- conversation table ---
    if "channel" not in conversation_columns:
        op.add_column(
            "conversation",
            sa.Column("channel", sa.VARCHAR(length=20), nullable=False, server_default="chat"),
        )
    if "status" not in conversation_columns:
        op.add_column(
            "conversation",
            sa.Column("status", sa.VARCHAR(length=20), nullable=False, server_default="active"),
        )
        op.create_index(op.f("ix_conversation_status"), "conversation", ["status"])
    if "assigned_to" not in conversation_columns:
        op.add_column(
            "conversation",
            sa.Column("assigned_to", sa.VARCHAR(), nullable=True),
        )
        op.create_foreign_key(
            "fk_conversation_assigned_to_user_email",
            "conversation",
            "user",
            ["assigned_to"],
            ["email"],
        )
    if "visitor_name" not in conversation_columns:
        op.add_column(
            "conversation",
            sa.Column("visitor_name", sa.VARCHAR(length=128), nullable=True),
        )
    if "visitor_email" not in conversation_columns:
        op.add_column(
            "conversation",
            sa.Column("visitor_email", sa.VARCHAR(length=255), nullable=True),
        )
    if "visitor_id" not in conversation_columns:
        op.add_column(
            "conversation",
            sa.Column("visitor_id", sa.VARCHAR(length=128), nullable=True),
        )
    if "tags" not in conversation_columns:
        op.add_column(
            "conversation",
            sa.Column("tags", sa.VARCHAR(), nullable=False, server_default=""),
        )
    if "source" not in conversation_columns:
        op.add_column(
            "conversation",
            sa.Column("source", sa.VARCHAR(length=128), nullable=False, server_default="Chat widget"),
        )
    if "pages_visited" not in conversation_columns:
        op.add_column(
            "conversation",
            sa.Column("pages_visited", sa.INTEGER(), nullable=False, server_default="0"),
        )

    # --- chatmessage table ---
    if "chatmessage" in inspector.get_table_names():
        if "sender" not in chatmessage_columns:
            op.add_column(
                "chatmessage",
                sa.Column("sender", sa.VARCHAR(length=20), nullable=False, server_default="visitor"),
            )
            # Backfill sender from existing role values.
            conn.execute(
                sa.text(
                    "UPDATE chatmessage SET sender = "
                    "CASE "
                    "  WHEN role = 'user' THEN 'visitor' "
                    "  WHEN role = 'assistant' THEN 'ai' "
                    "  ELSE 'visitor' "
                    "END"
                )
            )
        if "read" not in chatmessage_columns:
            op.add_column(
                "chatmessage",
                sa.Column("read", sa.BOOLEAN(), nullable=False, server_default=sa.text("false")),
            )


def downgrade() -> None:
    """Revert conversation metadata and chatmessage sender/read columns."""
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if "chatmessage" in inspector.get_table_names():
        chatmessage_columns = {c["name"] for c in inspector.get_columns("chatmessage")}
        if "read" in chatmessage_columns:
            op.drop_column("chatmessage", "read")
        if "sender" in chatmessage_columns:
            op.drop_column("chatmessage", "sender")

    if "conversation" in inspector.get_table_names():
        conversation_columns = {c["name"] for c in inspector.get_columns("conversation")}
        if "pages_visited" in conversation_columns:
            op.drop_column("conversation", "pages_visited")
        if "source" in conversation_columns:
            op.drop_column("conversation", "source")
        if "tags" in conversation_columns:
            op.drop_column("conversation", "tags")
        if "visitor_id" in conversation_columns:
            op.drop_column("conversation", "visitor_id")
        if "visitor_email" in conversation_columns:
            op.drop_column("conversation", "visitor_email")
        if "visitor_name" in conversation_columns:
            op.drop_column("conversation", "visitor_name")
        if "assigned_to" in conversation_columns:
            op.drop_constraint(
                "fk_conversation_assigned_to_user_email",
                "conversation",
                type_="foreignkey",
            )
            op.drop_column("conversation", "assigned_to")
        if "status" in conversation_columns:
            op.drop_index(op.f("ix_conversation_status"), table_name="conversation")
            op.drop_column("conversation", "status")
        if "channel" in conversation_columns:
            op.drop_column("conversation", "channel")
