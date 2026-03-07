/**
 * AI Resume Screening System – results.js
 * Reads screening results from sessionStorage and renders the dashboard.
 */

(function () {
  "use strict";

  // ── DOM refs ─────────────────────────────────────────────────
  const resultSummary       = document.getElementById("resultSummary");
  const summaryCards        = document.getElementById("summaryCards");
  const totalCountEl        = document.getElementById("totalCount");
  const topScoreEl          = document.getElementById("topScore");
  const avgScoreEl          = document.getElementById("avgScore");
  const excellentCountEl    = document.getElementById("excellentCount");
  const filterBar           = document.getElementById("filterBar");
  const searchInput         = document.getElementById("searchInput");
  const filterButtons       = document.querySelectorAll(".filter-btn");
  const candidatesContainer = document.getElementById("candidatesContainer");
  const loadingState        = document.getElementById("loadingState");
  const skillsPanel         = document.getElementById("skillsPanel");
  const jobSkillsList       = document.getElementById("jobSkillsList");
  const detailModal         = document.getElementById("detailModal");
  const modalClose          = document.getElementById("modalClose");
  const modalBackdrop       = document.getElementById("modalBackdrop");
  const modalTitle          = document.getElementById("modalTitle");
  const modalBody           = document.getElementById("modalBody");

  let allCandidates = [];
  let activeFilter  = "all";

  // ── Load Data ────────────────────────────────────────────────
  const raw = sessionStorage.getItem("screeningResults");
  if (!raw) {
    loadingState.innerHTML = `
      <div class="empty-icon">😕</div>
      <p>No results found. <a href="/">Go back and screen some resumes.</a></p>`;
    return;
  }

  const data = JSON.parse(raw);
  allCandidates = data.candidates || [];

  loadingState.classList.add("hidden");
  renderDashboard();

  // ── Render Dashboard ─────────────────────────────────────────
  function renderDashboard() {
    const count   = allCandidates.length;
    const topScore = count ? allCandidates[0].score : 0;
    const avgScore = count
      ? (allCandidates.reduce((s, c) => s + c.score, 0) / count).toFixed(1)
      : 0;
    const excellent = allCandidates.filter((c) => c.rank_label === "Excellent").length;

    resultSummary.textContent = `Screened ${count} candidate${count !== 1 ? "s" : ""} • Top match: ${topScore}%`;

    totalCountEl.textContent    = count;
    topScoreEl.textContent      = topScore + "%";
    avgScoreEl.textContent      = avgScore + "%";
    excellentCountEl.textContent = excellent;

    summaryCards.classList.remove("hidden");
    filterBar.classList.remove("hidden");

    // Job skills
    if (allCandidates.length && allCandidates[0].job_skills.length) {
      allCandidates[0].job_skills.forEach((skill) => {
        const tag = document.createElement("span");
        tag.className = "skill-tag";
        tag.textContent = skill;
        jobSkillsList.appendChild(tag);
      });
      skillsPanel.classList.remove("hidden");
    }

    renderCandidates();
    attachFilterListeners();
  }

  // ── Render Candidate Cards ───────────────────────────────────
  function renderCandidates() {
    const query   = searchInput.value.toLowerCase().trim();
    const filtered = allCandidates.filter((c) => {
      const matchFilter =
        activeFilter === "all" || c.rank_label === activeFilter;
      const matchSearch =
        !query ||
        c.candidate_name.toLowerCase().includes(query) ||
        c.filename.toLowerCase().includes(query) ||
        c.matched_skills.some((s) => s.toLowerCase().includes(query));
      return matchFilter && matchSearch;
    });

    // Clear old cards (keep loading state hidden)
    Array.from(candidatesContainer.children).forEach((child) => {
      if (child.id !== "loadingState") child.remove();
    });

    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.innerHTML = `<div class="empty-icon">🔎</div><p>No candidates match your filter.</p>`;
      candidatesContainer.appendChild(empty);
      return;
    }

    filtered.forEach((candidate, idx) => {
      const originalRank = allCandidates.indexOf(candidate) + 1;
      const card = buildCandidateCard(candidate, originalRank);
      candidatesContainer.appendChild(card);

      // Animate score circle after DOM insert
      setTimeout(() => animateScoreCircle(card, candidate.score), 100);
    });
  }

  // ── Build a single candidate card ───────────────────────────
  function buildCandidateCard(c, rank) {
    const card = document.createElement("div");
    card.className = "candidate-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `View details for ${c.candidate_name}`);

    const rankClass = rank <= 3 ? `rank-${rank}` : "";
    const rankEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;

    const topSkills = c.matched_skills.slice(0, 5);
    const skillTags = topSkills
      .map((s) => `<span class="skill-tag">${escHtml(s)}</span>`)
      .join("");
    const extraSkills =
      c.matched_skills.length > 5
        ? `<span class="skill-tag">+${c.matched_skills.length - 5} more</span>`
        : "";

    const circumference = 2 * Math.PI * 30; // r=30

    card.innerHTML = `
      <div class="candidate-rank ${rankClass}">${rankEmoji}</div>
      <div class="candidate-info">
        <div class="candidate-name">${escHtml(c.candidate_name)}</div>
        <div class="candidate-filename">📎 ${escHtml(c.filename)}</div>
        <div class="candidate-skills">${skillTags}${extraSkills}</div>
      </div>
      <div class="candidate-score">
        <div class="score-circle">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle class="score-bg" cx="40" cy="40" r="30" fill="none" stroke-width="6"/>
            <circle
              class="score-fill"
              cx="40" cy="40" r="30"
              fill="none"
              stroke-width="6"
              stroke="${scoreColor(c.score)}"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${circumference}"
              stroke-linecap="round"
              data-score="${c.score}"
            />
          </svg>
          <div class="score-value">${c.score}%</div>
        </div>
        <div class="score-label ${c.score_color}">${c.rank_label}</div>
      </div>
    `;

    // Click / keyboard to open detail modal
    const openModal = () => showDetailModal(c, rank);
    card.addEventListener("click", openModal);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(); }
    });

    return card;
  }

  function animateScoreCircle(card, score) {
    const fill = card.querySelector(".score-fill");
    if (!fill) return;
    const circumference = 2 * Math.PI * 30;
    const offset = circumference - (score / 100) * circumference;
    fill.style.strokeDashoffset = offset;
  }

  function scoreColor(score) {
    if (score >= 75) return "#10b981";
    if (score >= 50) return "#3b82f6";
    if (score >= 25) return "#f59e0b";
    return "#ef4444";
  }

  // ── Detail Modal ─────────────────────────────────────────────
  function showDetailModal(c, rank) {
    modalTitle.textContent = c.candidate_name;

    const matchedList = c.matched_skills.length
      ? c.matched_skills.map((s) => `<span class="skill-tag">${escHtml(s)}</span>`).join("")
      : "<em style='color:var(--text-dim)'>None detected</em>";

    const missingList = c.missing_skills.length
      ? c.missing_skills.map((s) => `<span class="skill-tag missing">${escHtml(s)}</span>`).join("")
      : "<em style='color:var(--text-dim)'>None — great match!</em>";

    modalBody.innerHTML = `
      <div class="modal-section">
        <h4>Overall Match Score</h4>
        <div style="display:flex;align-items:center;gap:1rem;margin-top:0.5rem">
          <span style="font-size:2rem;font-weight:700;color:var(--text)">${c.score}%</span>
          <span class="score-label ${c.score_color}">${c.rank_label}</span>
        </div>
        <div class="modal-score-bar">
          <div class="modal-score-fill" style="width:0%" data-width="${c.score}%"></div>
        </div>
      </div>

      <div class="modal-section">
        <h4>📁 File</h4>
        <p style="color:var(--text-muted)">${escHtml(c.filename)}</p>
      </div>

      <div class="modal-section">
        <h4>✅ Matched Skills (${c.matched_skills.length})</h4>
        <div class="candidate-skills" style="margin-top:0.4rem">${matchedList}</div>
      </div>

      <div class="modal-section">
        <h4>❌ Missing Skills (${c.missing_skills.length})</h4>
        <div class="candidate-skills" style="margin-top:0.4rem">${missingList}</div>
      </div>

      <div class="modal-section">
        <h4>🛠️ All Resume Skills (${c.resume_skills.length})</h4>
        <div class="candidate-skills" style="margin-top:0.4rem">
          ${c.resume_skills.map((s) => `<span class="skill-tag">${escHtml(s)}</span>`).join("") || "<em style='color:var(--text-dim)'>None detected</em>"}
        </div>
      </div>
    `;

    detailModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Animate score bar
    setTimeout(() => {
      const fill = modalBody.querySelector(".modal-score-fill");
      if (fill) fill.style.width = fill.dataset.width;
    }, 100);
  }

  function closeModal() {
    detailModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ── Filter & Search ──────────────────────────────────────────
  function attachFilterListeners() {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        renderCandidates();
      });
    });

    searchInput.addEventListener("input", () => renderCandidates());
  }

  // ── Utilities ────────────────────────────────────────────────
  function escHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
