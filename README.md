VerseVibe: An AI-Powered Writing Companion
VerseVibe is a specialized editor designed for poets and writers. It uses the Gemini 1.5 Flash API to act as "TalkingBuddy," providing empathetic, real-time sentiment analysis and pacing advice. The application features a sentiment-reactive UI where the interface colors shift dynamically to match the emotional tone of the writing.

This project was built as a technical assessment for Better, specifically tailored to align with the Smile Artist brand.

🚀 Technical Stack
Frontend: React (Vite), Framer Motion (Animations), Lucide React (Icons).

Backend: Python 3.10+, Flask API.

Database: SQLite (Relational) via SQLAlchemy ORM.

AI Integration: Google Gemini 1.5 Flash.

🛠️ Key Technical Decisions
1. Decoupled Architecture
The project follows a strict separation of concerns. The Flask backend handles data persistence and AI orchestration, while the React frontend manages the user's emotional experience and state.

2. Relational Database Modeling
I implemented a One-to-Many relationship using SQLAlchemy to meet the assessment requirements.

User Table: Stores user identity (defaults to "Smile Artist" for this assessment).

Manuscript Table: Stores the raw text content, the timestamp, and the associated AI feedback.

Decision: SQLite was chosen for this assessment to ensure portability and zero-configuration for the reviewers.

3. Sentiment-Reactive UI Engine
Instead of a static dashboard, I built a reactive theme engine.

The frontend parses the JSON output from the AI and updates a global theme state.

Framer Motion is used to transition background gradients and accent colors smoothly (e.g., shifting to a "Melancholic" blue or "Joyful" gold), creating an immersive writing environment.

4. Robust AI Parsing
AI outputs can be non-deterministic. I implemented a Regex-based cleaning layer on both the backend and frontend to strip markdown code blocks and extract raw JSON, ensuring the UI remains stable regardless of API formatting.

🤖 AI Usage & Guidance
In accordance with the assessment requirements, AI tools were used to accelerate development.

Code Generation: Used for boilerplate scaffolding (Flask models, initial React components).

AI Guidance Files: Refer to ai_guidance.md for the specific constraints and persona instructions (TalkingBuddy) provided to the agents during development.

🚧 Risks & Extensions
Current Risk: The free-tier Gemini API has rate limits. In a production environment, I would implement a Redis-based caching layer to store results for identical manuscripts.

Extension Approach: 1. Authentication: Integrate Google OAuth to allow users to save "Manuscripts" across sessions.
2. Collaborative Editing: Use WebSockets to allow "TalkingBuddy" to provide feedback in real-time as the user types.

🏃 How to Run
1. Backend Setup
Navigate to /backend.

Create a .env file with GEMINI_API_KEY=your_key.

Activate venv: .\venv\Scripts\activate (Windows) or source venv/bin/activate (Mac).

pip install flask flask-sqlalchemy flask-cors google-generativeai python-dotenv.

python app.py.

2. Frontend Setup
Navigate to /frontend.

npm install.

npm install axios framer-motion lucide-react.

npm run dev.