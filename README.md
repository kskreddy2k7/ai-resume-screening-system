# ⚡ TalentFlow AI (v3)

TalentFlow AI is a high-performance, single-page application built for creating, optimization, and real-time ATS analysis of professional resumes. Designed for elite software engineers and technology executives, it combines a Canva-style visual canvas, real-time grading, and automated matching.

---

## 🚀 Key Features

*   **Multi-Device Layout**: Fully optimized for mobile, tablet, and desktop screens with a mobile tab navigation bar in the workspace.
*   **Visual Resume Editor**: Inline field editing, custom theme colors, section drag-and-drop reordering, and template presets.
*   **Intelligence Engine**: Real-time ATS scorecard, missing keyword detector, recommendation panel, and custom LLM prompts.
*   **Automated Importer**: Quick parser that extracts structural details from existing PDF, DOCX, and TXT files.
*   **Recruiter-grade Export**: Print-ready, single-page A4 PDF output with exact CSS margins, plus editable Word (DOCX) downloads.

---

## 📂 Project Structure & Key Files

```text
ai-resume-screening-system/
├── electron/                 # Electron main process config for desktop packaging
├── public/                   # Static public assets (demo video, favicon, 404 handler)
│   ├── demo.mp4              # Demonstration video played on landing page & hero
│   └── 404.html              # Custom SPA route resolution for GitHub Pages
├── src/
│   ├── components/
│   │   ├── common/           # Custom buttons, input indicators, modals
│   │   ├── editor/           # Canvas & Resume Template engines
│   │   │   ├── templates/    # Core styles: Executive, Minimal, Modern, Professional
│   │   │   ├── A4Canvas.tsx  # Dynamic print-to-scale A4 layout preview container
│   │   │   └── Toolbar.tsx   # Top toolbar containing Undo/Redo & export actions
│   │   └── workspace/        # Editor panels
│   │       ├── SidebarEditor.tsx # Accordion with fields, layout styling & ordering
│   │       └── AIAssistant.tsx   # ATS Scorecards & Job Match panel
│   ├── lib/
│   │   ├── ai.ts             # Local ATS scoring heuristic and matching mock engine
│   │   ├── export.ts         # High-fidelity DOCX generation and PDF window print trigger
│   │   ├── extractor.ts      # Extractor strategies for PDF, DOCX and TXT files
│   │   └── utils.ts          # Tailwind and class names merging helpers
│   ├── pages/
│   │   ├── onboarding/       # Multi-step flow: Template, Import, Guided Wizard
│   │   ├── LandingPage.tsx   # Visual dashboard & product introduction page
│   │   └── Workspace.tsx     # The 3-panel core editor dashboard
│   ├── store/
│   │   ├── aiStore.ts        # Zustand state for ATS results & Job Matches
│   │   ├── editorStore.ts    # Zustand state for Undo/Redo history tracking
│   │   └── resumeStore.ts    # Zustand state for resume details & template configs
│   ├── App.tsx               # Main routes declaration (React Router 7)
│   └── index.css             # Tailwind v4 main stylesheet & custom scrollbar
└── vite.config.ts            # Vite bundler configuration
```

---

## 🛠️ Local Development & Operations

### 1. Requirements
*   **Node.js**: v18.0.0 or higher
*   **npm**: v9.0.0 or higher

### 2. Setup
Clone the repository and install all dependencies:
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build Production Bundle
Build and verify bundle size optimization:
```bash
npm run build
```

### 5. Deploy to GitHub Pages
Compile production code and publish build artifact directly to the `gh-pages` branch:
```bash
npm run deploy
```

---

## 🖥️ Desktop Application (Electron)

TalentFlow AI includes pre-configured settings to package the web app as a standalone cross-platform desktop application.

*   Run in Electron development environment:
    ```bash
    npm run electron:dev
    ```
*   Build binaries for your OS (Windows/macOS/Linux):
    ```bash
    npm run electron:build
    ```

---

## 🎨 UI & Responsive Optimization Design

### Layout Switching Strategy
*   **Desktop (`>= 1024px`)**: Renders three vertical panels side-by-side: `SidebarEditor` (form inputs) on the left, `A4Canvas` (real-time preview) in the center, and `AIAssistant` (ATS metrics) on the right.
*   **Mobile/Tablet (`< 1024px`)**: Adapts to a single-panel viewport. The user navigates using a modern bottom tab bar (`Edit`, `Preview`, `AI Scan`). The template layout selection and color options are automatically pinned at the top of the Edit sidebar so mobile users can easily access design controls.
*   **Navigation & Onboarding**: Header navigation links hide on small devices. Onboarding progress tracks use scaled circles and flex configurations to fit within narrow smartphone viewports.
