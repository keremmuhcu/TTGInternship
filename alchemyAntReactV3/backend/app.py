from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./moviesdb.db'
    app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # JWT için bir gizli anahtar belirleyin
    
    db.init_app(app)
    jwt = JWTManager(app)  # JWT yapılandırması
    
    from routes import register_routes
    register_routes(app, db)
    migrate = Migrate(app, db)
    
    return app