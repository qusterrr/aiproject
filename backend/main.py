from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

sessions = {}

SYSTEM_PROMPTS = {
    "explain": "You are a helpful study assistant. Explain concepts clearly with examples. Be concise.",
    "quiz": "You are a quiz master. Ask the user one question at a time. Evaluate their answer and give feedback before asking the next."
}

class ChatRequest(BaseModel):
    session_id: str
    message: str
    mode: str

@app.post("/chat")
async def chat(req: ChatRequest):
    history = sessions.setdefault(req.session_id, [])
    history.append({"role": "user", "parts": [req.message]})

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=SYSTEM_PROMPTS[req.mode]
    )
    chat_session = model.start_chat(history=history[:-1])
    response = chat_session.send_message(req.message)
    reply = response.text

    history.append({"role": "model", "parts": [reply]})
    return {"response": reply}