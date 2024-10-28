"""Initial migration

Revision ID: 1938cc64cf7f
Revises: 
Create Date: 2024-08-16 10:44:38.873569

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1938cc64cf7f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('movies',
    sa.Column('mid', sa.Integer(), nullable=False),
    sa.Column('title', sa.Text(), nullable=False),
    sa.Column('year', sa.Integer(), nullable=False),
    sa.Column('score', sa.Text(), nullable=False),
    sa.Column('imdb_url', sa.Text(), nullable=False),
    sa.PrimaryKeyConstraint('mid')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('movies')
    # ### end Alembic commands ###