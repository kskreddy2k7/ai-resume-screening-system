# TalentFlow AI 2.0 🧠💼

> **Build, Analyze, Optimize, and Get Hired.**

TalentFlow AI is a production-ready, full-stack AI SaaS platform designed for candidates and recruiters. It replaces basic keyword matching with state-of-the-art semantic AI, powerful PDF parsing, and a stunning modern user interface.

## 🌟 Key Features

1. **AI Resume Builder**: 8-step wizard to craft professional resumes.
2. **True Semantic AI Matching**: Powered by `sentence-transformers` (`all-MiniLM-L6-v2`) and `spaCy` running on a Python backend.
3. **Advanced PDF Parsing**: Utilizes `PyMuPDF` for highly accurate, layout-aware text extraction.
4. **Authentication**: Secure JWT-based Auth system with MongoDB.
5. **Dashboard Analytics**: Track resume performance and job matching trends using `Recharts`.
6. **Premium UI/UX**: Built with React, Tailwind CSS, Shadcn UI, and Framer Motion for a tier-1 SaaS aesthetic.
7. **Document Export**: Dynamically generate ATS-friendly PDFs using `fpdf2`.

---

## 🏗️ Architecture Stack

- **Frontend**: Vite + React + TypeScript + Zustand + Tailwind CSS + Framer Motion
- **Backend**: Python 3 + FastAPI + Motor (Async MongoDB)
- **Database**: MongoDB
- **AI/ML**: `sentence-transformers`, `torch`, `spacy` (`en_core_web_sm`)
- **Document Processing**: `PyMuPDF` (Ingestion), `fpdf2` (Export)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- MongoDB running locally on port `27017` (or modify `MONGODB_URL` in `.env`)

### 1. Start the Backend (FastAPI)

Open a terminal and navigate to the project root:

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Start the server
python run.py
```
*The backend will run on `http://localhost:8000`*

### 2. Start the Frontend (Vite)

Open a new terminal and navigate to the project root:

```bash
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 📸 Workflows

1. **Sign Up / Login**: Create an account to access the platform.
2. **Build a Resume**: Navigate to the Resume Builder to generate a structured resume profile saved directly to the database.
3. **Export to PDF**: From the Dashboard, click the download icon to instantly generate a professional PDF.
4. **Screening Workspace**: Upload an external PDF resume and paste a Job Description. The FastAPI server will parse the PDF, run NLP entity extraction, and calculate the semantic Cosine Similarity.

---
*Built as a world-class startup product.*
