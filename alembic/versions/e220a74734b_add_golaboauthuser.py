"""Add GoLabOAuthUser

Revision ID: e220a74734b
Revises: 16ac195d729e
Create Date: 2015-04-09 20:45:48.373302

"""

# revision identifiers, used by Alembic.
revision = 'e220a74734b'
down_revision = '16ac195d729e'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('GoLabOAuthUsers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('display_name', sa.Unicode(length=255), nullable=False),
    sa.Column('email', sa.Unicode(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(u'ix_GoLabOAuthUsers_display_name', 'GoLabOAuthUsers', ['display_name'], unique=False)
    op.create_index(u'ix_GoLabOAuthUsers_email', 'GoLabOAuthUsers', ['email'], unique=True)
    op.add_column(u'TranslationBundles', sa.Column('from_developer', sa.Boolean(), nullable=True))
    op.create_index(u'ix_TranslationBundles_from_developer', 'TranslationBundles', ['from_developer'], unique=False)
    try:
        op.drop_constraint(u'TranslationMessageHistory_ibfk_2', 'TranslationMessageHistory', type_='foreignkey')
        op.create_foreign_key(None, 'TranslationMessageHistory', 'GoLabOAuthUsers', ['user_id'], ['id'])
    except:
        print "drop_constraint and create_foreign_key not supported in SQLite"
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'TranslationMessageHistory', type_='foreignkey')
    op.create_foreign_key(u'TranslationMessageHistory_ibfk_2', u'TranslationMessageHistory', u'Users', [u'user_id'], [u'id'])
    op.drop_index(u'ix_TranslationBundles_from_developer', table_name='TranslationBundles')
    op.drop_column(u'TranslationBundles', 'from_developer')
    op.drop_index(u'ix_GoLabOAuthUsers_email', table_name='GoLabOAuthUsers')
    op.drop_index(u'ix_GoLabOAuthUsers_display_name', table_name='GoLabOAuthUsers')
    op.drop_table('GoLabOAuthUsers')
    ### end Alembic commands ###
