"""Add translation_percent

Revision ID: f62656baeb0
Revises: 2f6ca870f8b9
Create Date: 2015-04-12 05:03:10.204189

"""

# revision identifiers, used by Alembic.
revision = 'f62656baeb0'
down_revision = '2f6ca870f8b9'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('RepositoryApps', sa.Column('translation_percent', sa.UnicodeText(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('RepositoryApps', 'translation_percent')
    ### end Alembic commands ###
