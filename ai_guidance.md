# VerseVibe AI Orchestration Rules

### 1. Coding Standards
- **Backend:** Flask (Python 3.10+), PEP8 compliance, SQLAlchemy for ORM.
- **Frontend:** React (Vite), Tailwind CSS for styling, Functional Components only.

### 2. Prompt Constraints (For LLM Integration)
- All AI analysis must be returned as a **JSON object**.
- Tone: The "TalkingBuddy" persona must be empathetic, artistic, and supportive.
- Safety: Do not store raw API keys in code; use `.env`.

### 3. Database Strategy
- Use SQLite for portability during the assessment review.
- Maintain a One-to-Many relationship (User -> Manuscripts).