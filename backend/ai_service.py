import os
from dotenv import load_dotenv
from google import genai

# Load .env from the same directory as this file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    client = genai.Client(api_key=api_key)
    print("✅ Gemini API configured successfully.")
else:
    client = None
    print("⚠️  WARNING: GEMINI_API_KEY not found. Add it to backend/.env")

def analyze_writing(content):
    if not client:
        raise ValueError(
            "GEMINI_API_KEY is missing. Create a file at backend/.env with:\n"
            "GEMINI_API_KEY=your_key_here"
        )

    prompt = f"""
    You are 'TalkingBuddy', a supportive and insightful AI companion for poets and creative writers.
    Analyze this text: "{content}"

    IMPORTANT: Respond ONLY with a valid JSON object. No markdown, no code fences, no extra text.
    {{
        "sentiment": "One word (choose from: Melancholic, Joyful, Dark, Energetic, Peaceful, Thoughtful, Romantic, Mysterious)",
        "suggestions": "Two warm, encouraging sentences of constructive feedback",
        "pacing": "One sentence about the rhythm and flow of the piece",
        "wordChoice": "One sentence about the vocabulary and imagery used",
        "tone": "One sentence describing the overall emotional tone"
    }}
    """
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text