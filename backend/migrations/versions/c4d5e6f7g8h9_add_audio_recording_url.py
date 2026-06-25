"""add audio_recording_url to conversation

Revision ID: c4d5e6f7g8h9
Revises: b3c4d5e6f7g8
Create Date: 2026-06-25 14:00:00.000000

"""
from typing import Sequence, Union
import sqlalchemy as sa
from alembic import op

revision: str = "c4d5e6f7g8h9"
down_revision: Union[str, None] = "b3c4d5e6f7g8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if "conversation" not in inspector.get_table_names():
        return

    conversation_columns = {c["name"] for c in inspector.get_columns("conversation")}

    if "audio_recording_url" not in conversation_columns:
        op.add_column(
            "conversation",
            sa.Column("audio_recording_url", sa.VARCHAR(length=512), nullable=True),
        )


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    if "conversation" in inspector.get_table_names():
        conversation_columns = {c["name"] for c in inspector.get_columns("conversation")}
        if "audio_recording_url" in conversation_columns:
            op.drop_column("conversation", "audio_recording_url")
