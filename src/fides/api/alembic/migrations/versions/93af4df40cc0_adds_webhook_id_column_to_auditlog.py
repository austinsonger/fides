"""adds webhook_id column to auditLog

Revision ID: 93af4df40cc0
Revises: 6cfd59e7920a
Create Date: 2024-04-20 13:17:33.928813

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "93af4df40cc0"
down_revision = "55bedede956d"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("auditlog", sa.Column("webhook_id", sa.String(), nullable=True))
    op.create_index(
        op.f("ix_auditlog_webhook_id"), "auditlog", ["webhook_id"], unique=False
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_auditlog_webhook_id"), table_name="auditlog")
    op.drop_column("auditlog", "webhook_id")
    # ### end Alembic commands ###
