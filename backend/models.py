from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    # One-to-Many: One user can have many manuscripts
    manuscripts = db.relationship('Manuscript', backref='author', lazy=True)

class Manuscript(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False, default="Untitled")
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # AI Analysis stored with the manuscript
    sentiment = db.Column(db.String(50))
    ai_feedback = db.Column(db.Text)