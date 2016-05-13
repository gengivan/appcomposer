"""Add last check

Revision ID: 5ac5404bfcd9
Revises: 100cfe53a84
Create Date: 2015-05-11 18:13:41.180372

"""

# revision identifiers, used by Alembic.
revision = '5ac5404bfcd9'
down_revision = '100cfe53a84'

import datetime
from alembic import op
import sqlalchemy as sa
import sqlalchemy.sql as sql

import sys
sys.path.append('.')

from appcomposer.db import db
from appcomposer.application import app

metadata = db.MetaData()
translation_subscriptions = db.Table('TranslationSubscriptions', metadata,
    db.Column('last_check', sa.DateTime())
)


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('TranslationSubscriptions', sa.Column('last_check', sa.DateTime(), nullable=True))
    op.create_index(u'ix_TranslationSubscriptions_last_check', 'TranslationSubscriptions', ['last_check'], unique=False)
    ### end Alembic commands ###
    with app.app_context():
        update_stmt = translation_subscriptions.update().where(translation_subscriptions.c.last_check == None).values(last_check = datetime.datetime.utcnow() - datetime.timedelta(hours = 72))
        db.session.execute(update_stmt)
        db.session.commit()


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(u'ix_TranslationSubscriptions_last_check', table_name='TranslationSubscriptions')
    op.drop_column('TranslationSubscriptions', 'last_check')
    ### end Alembic commands ###
