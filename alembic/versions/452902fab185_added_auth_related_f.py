"""Added auth-related fields to User

Revision ID: 452902fab185
Revises: 501404b36cef
Create Date: 2013-09-24 12:42:04.461000

"""

# revision identifiers, used by Alembic.
revision = '452902fab185'
down_revision = '501404b36cef'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('Users', sa.Column('auth_data', sa.Unicode(length=255), nullable=True))
    op.add_column('Users', sa.Column('auth_system', sa.Unicode(length=20), nullable=True))
def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    #op.drop_column('Users', 'auth_system')
    #op.drop_column('Users', 'auth_data')
    ### end Alembic commands ###