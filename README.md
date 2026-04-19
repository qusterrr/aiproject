# Study Chat

An AI-powered study assistant that helps students understand and review material through conversation.

## Project Description
Study Chat is a web application where students can upload their study notes (TXT or PDF) and chat with an AI assistant. The AI can explain topics clearly with examples, or switch into quiz mode where it asks questions one at a time and gives feedback on answers. The app remembers the full conversation so context is maintained throughout the session.

## Architecture Overview
React (frontend) → FastAPI (backend) → Google Gemini API (LLM)

The React frontend sends user messages to the FastAPI backend via HTTP POST. The backend maintains conversation history per session and injects uploaded file content into the system prompt so the AI has context of the study material. Mode switching is handled by swapping the system prompt sent to Gemini.

## Technical Choices
- **React** — frontend UI, chosen for component-based structure and straightforward state management with hooks
- **FastAPI** — Python backend, chosen for simplicity and fast setup with automatic API docs
- **Google Gemini 2.5 Flash Lite** — LLM provider, chosen because it is free tier and fast
- **PyPDF2** — extracts text from uploaded PDF files, lightweight and easy to integrate
- **python-dotenv** — loads API keys from .env file to keep credentials out of source code
- **Session-based memory** — conversation history stored in a Python dict keyed by random session ID, giving the AI multi-turn memory without a database
- **System prompt switching** — Explain and Quiz Me modes use different system prompts to change AI behavior without changing the model or making additional API calls

## Setup and Running Instructions

### Requirements
- Node.js 22+
- Python 3.12+
- Google Gemini API key (free at https://aistudio.google.com)

### 1. Clone the repository
```bash
git clone https://github.com/qusterrr/aiproject
cd aiproject
```

### 2. Backend setup
```bash
cd backend
pip install fastapi uvicorn google-generativeai python-dotenv pypdf2 python-multipart
```

Create a `.env` file inside the `backend` folder:

GEMINI_API_KEY=your_key_here

Start the backend:
```bash
python -m uvicorn main:app --reload
```

### 3. Frontend setup
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Known Limitations
- Conversation history is stored in memory — restarting the server clears all sessions
- No user authentication — anyone who can reach the server can use the app
- File upload supports TXT and PDF only; scanned PDFs without embedded text will not work
- Large files may exceed Gemini's context window and cause errors
- The free tier Gemini API allows only 20 requests per day per project — not suitable for multiple users
- No persistent storage — uploaded files and chat history are lost on server restart
- CORS is set to allow all origins (`*`) which is fine for local development but unsafe for production

## AI Tools Used
- **Claude (claude.ai)** —  debugging API errors
