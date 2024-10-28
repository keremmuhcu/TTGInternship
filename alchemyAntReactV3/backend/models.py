from app import db
from flask_login import UserMixin


class Movie(db.Model):
    __tablename__ = 'movies'
    
    mid = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.Text, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Text, nullable=False)
    imdb_url = db.Column(db.Text, nullable=False)
    
    baskets = db.relationship('Basket', backref='movie', cascade="all, delete", lazy=True)

class Basket(db.Model):
    __tablename__ = 'basket'
    
    bid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.mid', ondelete='CASCADE'), nullable=False)
    added_at = db.Column(db.DateTime, nullable=False)
    
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    uid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    
    def get_id(self):
        return self.uid