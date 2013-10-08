"""Added AppVersions table

Revision ID: 247238952b94
Revises: 33bc14d712b2
Create Date: 2013-10-02 14:52:00.747000

"""

# revision identifiers, used by Alembic.
revision = '247238952b94'
down_revision = '452902fab185'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('AppVersions',
    sa.Column('version_id', sa.Integer(), nullable=False),
    sa.Column('app_id', sa.Integer(), nullable=False),
    sa.Column('creation_date', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['app_id'], ['Apps.id'], ),
    sa.PrimaryKeyConstraint('version_id', 'app_id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('AppVersions')
    ### end Alembic commands ###
