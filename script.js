const skillBank = [
  "javascript", "typescript", "python", "java", "react", "vue", "node.js", "flask", "django",
  "sql", "postgresql", "mongodb", "aws", "docker", "kubernetes", "html", "css", "rest api",
  "nlp", "machine learning", "data analysis", "git", "linux", "pandas", "scikit-learn"
];

const state = {
  files: []
};

const dropZone = document.getElementById("dropZone");
const resumeInput = document.getElementById("resumeInput");
const fileList = document.getElementById("fileList");
const jobDescription = document.getElementById("jobDescription");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const results = document.getElementById("results");
const emptyState = document.getElementById("emptyState");
const resultMeta = document.getElementById("resultMeta");

function bytesToKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function fileSeed(file) {
  const text = `${file.name}:${file.size}`;
  let seed = 0;
  for (let i = 0; i < text.length; i += 1) {
    seed = (seed * 31 + text.charCodeAt(i)) % 100000;
  }
  return seed;
}

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickSkills(seed, count) {
  const chosen = new Set();
  for (let i = 0; i < count; i += 1) {
    const idx = Math.floor(seededRandom(seed + i * 23) * skillBank.length);
    chosen.add(skillBank[idx]);
  }
  return [...chosen];
}

function extractJobSkills(description) {
  const lower = description.toLowerCase();
  const matches = skillBank.filter((skill) => lower.includes(skill));
  if (matches.length >= 3) {
    return matches;
  }
  return ["javascript", "react", "sql", "docker", "aws"];
}

function scoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 45) return "Fair";
  return "Low";
}

function scoreClass(score) {
  if (score >= 80) return "score-excellent";
  if (score >= 65) return "score-good";
  if (score >= 45) return "score-fair";
  return "score-low";
}

function candidateNameFromFile(fileName) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[._-]+/g, " ").trim();
}

function renderFiles() {
  fileList.innerHTML = "";
  if (state.files.length === 0) {
    return;
  }

  state.files.forEach((file) => {
    const li = document.createElement("li");
    li.className = "file-item";
    li.innerHTML = `
      <span>${file.name}</span>
      <span class="file-size">${bytesToKB(file.size)}</span>
    `;
    fileList.appendChild(li);
  });
}

function addFiles(fileCollection) {
  const incoming = [...fileCollection];
  const allowedExt = ["pdf", "doc", "docx", "txt"];
  const filtered = incoming.filter((file) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    return allowedExt.includes(ext || "");
  });

  const uniqueMap = new Map(state.files.map((f) => [`${f.name}_${f.size}`, f]));
  filtered.forEach((file) => uniqueMap.set(`${file.name}_${file.size}`, file));
  state.files = [...uniqueMap.values()];
  renderFiles();
}

function resetApp() {
  state.files = [];
  resumeInput.value = "";
  jobDescription.value = "";
  fileList.innerHTML = "";
  results.innerHTML = "";
  emptyState.style.display = "block";
  resultMeta.textContent = "No results yet";
}

function createCard(candidate, index) {
  const card = document.createElement("article");
  card.className = "result-card";
  card.style.animationDelay = `${index * 90}ms`;

  const matchedTags = candidate.matchedSkills
    .slice(0, 6)
    .map((skill) => `<span class="tag match">${skill}</span>`)
    .join("");

  const missingTags = candidate.missingSkills
    .slice(0, 4)
    .map((skill) => `<span class="tag miss">${skill}</span>`)
    .join("");

  card.innerHTML = `
    <div class="result-top">
      <div>
        <h3 class="name">#${index + 1} ${candidate.name}</h3>
        <div class="rank">${candidate.label} match</div>
      </div>
      <div class="score-tag ${scoreClass(candidate.score)}">${candidate.score}%</div>
    </div>

    <div class="progress-wrap">
      <div class="progress" data-score="${candidate.score}"></div>
    </div>

    <div class="tags">${matchedTags || '<span class="tag match">No matched skills found</span>'}</div>
    <div class="tags">${missingTags || '<span class="tag miss">No missing skills detected</span>'}</div>
  `;

  return card;
}

function runSimulation() {
  if (state.files.length === 0) {
    window.alert("Please upload at least one resume file.");
    return;
  }

  const jd = jobDescription.value.trim();
  if (!jd) {
    window.alert("Please paste a job description before analysis.");
    return;
  }

  const jobSkills = extractJobSkills(jd);
  const candidates = state.files.map((file) => {
    const seed = fileSeed(file);
    const resumeSkills = pickSkills(seed, 7);
    const matchedSkills = resumeSkills.filter((skill) => jobSkills.includes(skill));
    const missingSkills = jobSkills.filter((skill) => !resumeSkills.includes(skill));

    const base = Math.round((matchedSkills.length / Math.max(1, jobSkills.length)) * 70);
    const variance = Math.round(seededRandom(seed + 999) * 30);
    const score = Math.min(98, Math.max(25, base + variance));

    return {
      name: candidateNameFromFile(file.name),
      score,
      label: scoreLabel(score),
      matchedSkills,
      missingSkills
    };
  });

  candidates.sort((a, b) => b.score - a.score);

  results.innerHTML = "";
  emptyState.style.display = "none";
  resultMeta.textContent = `${candidates.length} candidates ranked`;

  candidates.forEach((candidate, index) => {
    results.appendChild(createCard(candidate, index));
  });

  requestAnimationFrame(() => {
    document.querySelectorAll(".progress").forEach((bar) => {
      bar.style.width = `${bar.dataset.score}%`;
    });
  });
}

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.add("drag-over");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.remove("drag-over");
  });
});

dropZone.addEventListener("drop", (event) => {
  addFiles(event.dataTransfer.files);
});

dropZone.addEventListener("click", () => resumeInput.click());
dropZone.addEventListener("keypress", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    resumeInput.click();
  }
});

resumeInput.addEventListener("change", (event) => addFiles(event.target.files));
analyzeBtn.addEventListener("click", runSimulation);
clearBtn.addEventListener("click", resetApp);
