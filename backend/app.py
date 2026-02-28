import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Manuscript
from ai_service import analyze_writing

app = Flask(__name__)
CORS(app)

# Database Setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///versevibe.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "message": "VerseVibe backend is running!"})

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    content = data.get('content', '').strip()
    if not content:
        return jsonify({"error": "No content provided"}), 400

    try:
        raw_ai_response = analyze_writing(content)

        # Database persistence
        try:
            user = User.query.first()
            if not user:
                user = User(username="Smile Artist")
                db.session.add(user)
                db.session.commit()

            title = content[:60].strip() + ("..." if len(content) > 60 else "")
            new_entry = Manuscript(
                content=content,
                ai_feedback=raw_ai_response,
                user_id=user.id,
                title=title
            )
            db.session.add(new_entry)
            db.session.commit()
        except Exception as db_e:
            print(f"DB Log: {db_e}")

        return jsonify({"analysis": raw_ai_response})
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 503
    except Exception as e:
        print(f"Analysis error: {e}")
        return jsonify({"error": "Analysis failed. Please try again."}), 500

@app.route('/history', methods=['GET'])
def history():
    try:
        manuscripts = Manuscript.query.order_by(Manuscript.created_at.desc()).limit(10).all()
        result = []
        for m in manuscripts:
            result.append({
                "id": m.id,
                "title": m.title,
                "content": m.content[:200],
                "ai_feedback": m.ai_feedback,
                "created_at": m.created_at.isoformat()
            })
        return jsonify({"history": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)