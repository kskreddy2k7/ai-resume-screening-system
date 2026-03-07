# AI Resume Screening System

[![Static App](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-1f2937?style=for-the-badge)](AIResume)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-181717?style=for-the-badge&logo=github&logoColor=white)](https://pages.github.com/)
[![Vanilla JS](https://img.shields.io/badge/Runtime-Browser%20Only-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111)](AIResume/script.js)

Portfolio-ready resume screening project with a modern static demo built for GitHub Pages.

## Live Demo

- Format: `https://USERNAME.github.io/REPOSITORY-NAME/`
- For this repository: `https://kskreddy2k7.github.io/ai-resume-screening-system/`

## What Is Included

1. `AIResume/`: fully static app (HTML, CSS, JavaScript).
2. `.github/workflows/deploy.yml`: automated GitHub Pages deployment.

## Static Demo Features (`AIResume/`)

- Drag-and-drop resume uploads (`.pdf`, `.doc`, `.docx`, `.txt`)
- Job description input area
- JavaScript-based scoring simulation (no backend required)
- Animated progress bars and rank labels
- Ranked candidate list with matched/missing skill tags
- Dark AI-style interface with responsive layout

## Screenshots

![Workspace](AIResume/assets/screenshot-home.svg)

![Rankings](AIResume/assets/screenshot-results.svg)

## Quick Start (Static App)

```bash
git clone https://github.com/kskreddy2k7/ai-resume-screening-system.git
cd ai-resume-screening-system/AIResume
python -m http.server 8080
```

Open `http://localhost:8080`.

## GitHub Pages Deployment

Deployment workflow is already configured at `.github/workflows/deploy.yml` and publishes `AIResume/`.

1. Go to `Settings -> Pages`.
2. Set Source to `GitHub Actions`.
3. Push to `main`.
4. Wait for the `Deploy AIResume to GitHub Pages` workflow to complete.

## Repository Structure

```text
ai-resume-screening-system/
├── AIResume/                    # Static app for GitHub Pages
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── assets/
│   └── README.md
├── .github/workflows/deploy.yml # Pages deployment workflow
├── README.md
└── .gitignore
```

## Technologies

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Deployment: GitHub Actions, GitHub Pages
