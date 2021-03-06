"""Add app_image and app_link

Revision ID: 2f6ca870f8b9
Revises: 2f1bb61ffea
Create Date: 2015-04-12 04:37:44.524983

"""

# revision identifiers, used by Alembic.
revision = '2f6ca870f8b9'
down_revision = '2f1bb61ffea'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('RepositoryApps', sa.Column('app_image', sa.Unicode(length=255), nullable=True))
    op.add_column('RepositoryApps', sa.Column('app_link', sa.UnicodeText(), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('RepositoryApps', 'app_link')
    op.drop_column('RepositoryApps', 'app_image')
    ### end Alembic commands ###
