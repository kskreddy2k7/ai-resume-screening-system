# TalentFlow AI v3

Create, Edit, Analyze, Optimize and Export Professional Resumes Using AI.

## Overview

TalentFlow AI is a rebuilt resume SaaS platform with:

- Public product site (`/`, `/features`, `/pricing`, `/templates`, `/login`, `/register`)
- Private app workspace (`/app`) with dashboard, builder, analyzer, ATS scanner, job match, templates, library, profile, and settings
- Canva-style resume editing controls (inline editing, drag reorder, style controls, zoom, undo/redo, autosave)
- Resume import flow (PDF/DOCX/TXT text extraction strategy)
- ATS analysis engine and AI-style suggestion application
- Job description matcher with keyword density and missing skills
- Resume library with duplicate/rename/delete, version history and restore
- Print-ready PDF export (A4-oriented browser print flow)

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- React Router
- Lucide React
- React Hook Form
- Zustand (persisted local state)

## Project Structure

```text
src/
  components/
    common/
    layout/
  lib/
    analysis.ts
    defaults.ts
    importer.ts
  pages/
    public/
    app/
  store/
    usePlatformStore.ts
  types/
    resume.ts
```

## Local Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```

## Notes

- App state persists in browser storage via Zustand.
- PDF export uses `window.print()` for high-fidelity export from the current resume canvas.
- The import parser is intentionally lightweight and designed for iterative enhancement with backend OCR/NLP services.
