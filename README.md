<div align="center">

# 🤖 AI Resume Screening System

[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![NLTK](https://img.shields.io/badge/NLTK-3.9-green?style=for-the-badge)](https://www.nltk.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**An intelligent, production-ready resume screening system powered by NLP and Machine Learning.**  
Upload multiple resumes, describe the role, and instantly get AI-ranked candidates with skill gap analysis.

[🚀 Get Started](#-installation) · [🎯 Features](#-features) · [🏗️ Architecture](#️-architecture) · [📸 Screenshots](#-screenshots)

---

</div>

## ✨ Features

| Feature | Description |
|---|---|
| 📤 **Multi-Resume Upload** | Drag-and-drop or browse to upload PDF, DOCX, and TXT files in bulk |
| 🧠 **NLP-Powered Matching** | TF-IDF vectorization + cosine similarity for precise resume-to-job alignment |
| 🔍 **Skill Extraction** | Automatically detects 80+ technical skills from both resumes and job descriptions |
| 🏆 **Candidate Ranking** | Candidates ranked by match score with Excellent / Good / Fair / Low labels |
| 📊 **Score Visualisation** | Animated circular score gauges and progress bars per candidate |
| 🔎 **Search & Filter** | Real-time search and rank-label filtering across candidates |
| 📋 **Skill Gap Analysis** | Shows matched skills and missing skills for every candidate |
| 🎨 **Modern Dark UI** | Responsive, accessible dashboard with smooth animations |
| 🔌 **REST API** | Clean JSON API (`/api/screen`) consumable by any frontend or CI pipeline |
| ✅ **Error Handling** | Full validation, file-type and size guards, and descriptive error messages |

---

## 🏗️ Architecture

```
ai-resume-screening-system/
│
├── backend/                    # Python / Flask backend
│   ├── app.py                  # Application factory (create_app)
│   ├── routes/
│   │   └── api.py              # REST endpoints (/api/screen, /api/health)
│   ├── services/
│   │   ├── resume_parser.py    # PDF / DOCX / TXT text extraction
│   │   ├── text_processor.py   # Text cleaning, stop-word removal, skill extraction
│   │   └── job_matcher.py      # TF-IDF + cosine similarity scoring
│   ├── models/
│   │   └── candidate.py        # Candidate dataclass with ranking helpers
│   └── utils/
│       └── file_handler.py     # File validation, secure naming, size checks
│
├── frontend/                   # HTML / CSS / JS frontend
│   ├── templates/
│   │   ├── index.html          # Upload page (hero + drag-and-drop form)
│   │   └── results.html        # Candidate ranking dashboard
│   └── static/
│       ├── css/style.css       # Full design system (dark theme, components)
│       └── js/
│           ├── main.js         # Upload form logic
│           └── results.js      # Results rendering, modals, filters
│
├── uploads/                    # Saved resume files (git-ignored)
├── run.py                      # Root entry point
├── start.sh                    # Shell helper
└── requirements.txt            # Python dependencies
```

---

## 🤖 How It Works

```
Resume File(s)  +  Job Description
        │                 │
        ▼                 ▼
  Text Extraction    Text Cleaning
  (PDF/DOCX/TXT)   (NLTK stop-words)
        │                 │
        └────────┬─────────┘
                 ▼
        TF-IDF Vectorization
                 │
                 ▼
        Cosine Similarity  ──►  Match Score (0–100 %)
                 │
                 ▼
        Skill Extraction  ──►  Matched / Missing Skills
                 │
                 ▼
        Candidate Ranking (sorted desc)
                 │
                 ▼
        JSON Response  ──►  Dashboard UI
```

---

## 📸 Screenshots

> **Upload Page** — drag-and-drop interface with job description input

> **Results Dashboard** — ranked candidate cards with score gauges, skill tags, and detail modal

---

## 🚀 Installation

### Prerequisites
- Python 3.9 or higher
- pip

### 1. Clone the repository

```bash
git clone https://github.com/kskreddy2k7/ai-resume-screening-system.git
cd ai-resume-screening-system
```

### 2. Create and activate a virtual environment

```bash
# Linux / macOS
python -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
python run.py
```

Open your browser and visit **http://localhost:5000**

---

## 🎯 Usage

1. **Upload Resumes** — drag-and-drop or click to browse. Supports `.pdf`, `.docx`, `.doc`, `.txt`.
2. **Enter Job Description** — paste the full job posting text including skills and requirements.
3. **Screen** — click "Screen Resumes". The AI analyses all files in seconds.
4. **Review Results** — candidates are ranked by match score. Click any card for detailed skill analysis.

### REST API

```bash
# Screen resumes via curl
curl -X POST http://localhost:5000/api/screen \
  -F "job_description=Looking for a Python developer with Flask, ML, and NLP experience" \
  -F "resumes=@resume1.pdf" \
  -F "resumes=@resume2.docx"
```

**Response:**
```json
{
  "success": true,
  "candidates": [
    {
      "candidate_name": "John_Doe",
      "filename": "John_Doe.pdf",
      "score": 87.42,
      "rank_label": "Excellent",
      "score_color": "success",
      "matched_skills": ["flask", "nlp", "python", "scikit-learn"],
      "missing_skills": ["docker"],
      "resume_skills": ["flask", "nlp", "python", "react", "scikit-learn"],
      "job_skills": ["docker", "flask", "nlp", "python", "scikit-learn"]
    }
  ]
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.9+, Flask 3.1 |
| **NLP / ML** | scikit-learn (TF-IDF, cosine similarity), NLTK (stop-word removal) |
| **File Parsing** | PyPDF2 (PDF), python-docx (DOCX) |
| **Frontend** | HTML5, CSS3 (custom design system), Vanilla JavaScript |
| **Fonts** | Google Fonts – Inter |

---

## 🔮 Future Improvements

- [ ] 🧠 Transformer-based embeddings (BERT / Sentence-BERT) for semantic matching
- [ ] 🗄️ Database persistence (PostgreSQL / SQLite) for historical candidate tracking
- [ ] 📧 Email notifications for shortlisted candidates
- [ ] 🔐 Authentication & multi-user support
- [ ] 📁 ATS-style candidate pipeline management
- [ ] 📊 Advanced analytics dashboard with Chart.js
- [ ] 🐳 Docker / Docker Compose deployment config
- [ ] ☁️ One-click deploy to Heroku / Railway / Render

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [kskreddy2k7](https://github.com/kskreddy2k7)

⭐ Star this repo if you found it helpful!

</div>
