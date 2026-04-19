from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from PyPDF2 import PdfReader
import io
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

sessions = {}
file_contexts = {}

SYSTEM_PROMPTS = {
    "explain": "You are a helpful study assistant. Explain concepts clearly with examples. Be concise.",
    "quiz": "You are a quiz master. Ask the user one question at a time. Evaluate their answer and give feedback before asking the next."
}

class ChatRequest(BaseModel):
    session_id: str
    message: str
    mode: str


@app.post("/upload")
async def upload(session_id: str, file: UploadFile = File(...)):
    content = await file.read()
    
    if file.filename.endswith('.pdf'):
        pdf = PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    else:
        text = content.decode("utf-8")
    
    sessions.setdefault(session_id, [])
    file_contexts[session_id] = text
    return {"message": "File uploaded successfully"}
@app.post("/chat")
async def chat(req: ChatRequest):
    history = sessions.setdefault(req.session_id, [])
    history.append({"role": "user", "parts": [req.message]})

    base_prompt = SYSTEM_PROMPTS[req.mode]
    file_text = file_contexts.get(req.session_id)
    if file_text:
        system = base_prompt + f"\n\nThe user has uploaded the following study material:\n\n{file_text}"
    else:
        system = base_prompt

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash-lite",
        system_instruction=system
    )
    chat_session = model.start_chat(history=history[:-1])
    response = chat_session.send_message(req.message)
    reply = response.text

    history.append({"role": "model", "parts": [reply]})
    return {"response": reply}