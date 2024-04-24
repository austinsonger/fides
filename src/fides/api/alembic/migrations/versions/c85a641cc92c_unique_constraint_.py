"""unique constraint PreApprovalWebhookReply

Revision ID: c85a641cc92c
Revises: 93af4df40cc0
Create Date: 2024-04-23 19:47:07.836244

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "c85a641cc92c"
down_revision = "93af4df40cc0"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(
        "webhook_id_privacy_request_id",
        "preapprovalwebhookreply",
        ["webhook_id", "privacy_request_id"],
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(
        "webhook_id_privacy_request_id", "preapprovalwebhookreply", type_="unique"
    )
    # ### end Alembic commands ###
