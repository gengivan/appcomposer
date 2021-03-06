"""Add format to the database

Revision ID: 33dbbabeba2b
Revises: 16f121110a0f
Create Date: 2015-11-11 19:46:46.445211

"""

# revision identifiers, used by Alembic.
revision = '33dbbabeba2b'
down_revision = '16f121110a0f'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('ActiveTranslationMessages', sa.Column('fmt', sa.Unicode(length=255), nullable=True))
    op.create_index(u'ix_ActiveTranslationMessages_fmt', 'ActiveTranslationMessages', ['fmt'], unique=False)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(u'ix_ActiveTranslationMessages_fmt', table_name='ActiveTranslationMessages')
    op.drop_column('ActiveTranslationMessages', 'fmt')
    ### end Alembic commands ###
