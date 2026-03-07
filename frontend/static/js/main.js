/**
 * AI Resume Screening System – main.js
 * Handles drag-and-drop upload, form validation, and API submission.
 */

(function () {
  "use strict";

  // ── DOM refs ─────────────────────────────────────────────────
  const dropZone     = document.getElementById("dropZone");
  const fileInput    = document.getElementById("resumeInput");
  const fileList     = document.getElementById("fileList");
  const form         = document.getElementById("screeningForm");
  const jobDesc      = document.getElementById("jobDescription");
  const charCount    = document.getElementById("charCount");
  const errorBanner  = document.getElementById("errorBanner");
  const submitBtn    = document.getElementById("submitBtn");
  const btnText      = submitBtn.querySelector(".btn-text");
  const btnLoader    = submitBtn.querySelector(".btn-loader");

  /** @type {File[]} */
  let selectedFiles = [];

  // ── Character counter ────────────────────────────────────────
  jobDesc.addEventListener("input", () => {
    charCount.textContent = jobDesc.value.length.toLocaleString();
  });

  // ── Drag-and-drop ────────────────────────────────────────────
  ["dragenter", "dragover"].forEach((event) =>
    dropZone.addEventListener(event, (e) => {
      e.preventDefault();
      dropZone.classList.add("drag-over");
    })
  );

  ["dragleave", "drop"].forEach((event) =>
    dropZone.addEventListener(event, (e) => {
      e.preventDefault();
      dropZone.classList.remove("drag-over");
    })
  );

  dropZone.addEventListener("drop", (e) => {
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  });

  // Keyboard access for the drop zone
  dropZone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });

  // ── File input change ────────────────────────────────────────
  fileInput.addEventListener("change", () => {
    addFiles(Array.from(fileInput.files));
    fileInput.value = ""; // allow re-selecting same file
  });

  // ── Add files ────────────────────────────────────────────────
  function addFiles(files) {
    const allowed = ["pdf", "docx", "doc", "txt"];
    files.forEach((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      if (!allowed.includes(ext)) return;
      if (selectedFiles.some((f) => f.name === file.name && f.size === file.size)) return;
      selectedFiles.push(file);
    });
    renderFileList();
  }

  function renderFileList() {
    fileList.innerHTML = "";
    selectedFiles.forEach((file, idx) => {
      const li = document.createElement("li");
      li.className = "file-item";
      li.innerHTML = `
        <span class="file-item-icon">${fileIcon(file.name)}</span>
        <span class="file-item-name" title="${escHtml(file.name)}">${escHtml(file.name)}</span>
        <span class="file-item-size">${formatBytes(file.size)}</span>
        <button class="file-remove" aria-label="Remove ${escHtml(file.name)}" data-idx="${idx}">✕</button>
      `;
      fileList.appendChild(li);
    });

    fileList.querySelectorAll(".file-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = parseInt(btn.dataset.idx, 10);
        selectedFiles.splice(i, 1);
        renderFileList();
      });
    });
  }

  function fileIcon(name) {
    const ext = name.split(".").pop().toLowerCase();
    if (ext === "pdf") return "📕";
    if (["docx", "doc"].includes(ext)) return "📘";
    return "📄";
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function escHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // ── Form Submission ──────────────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const jd = jobDesc.value.trim();
    if (!jd) {
      showError("Please enter a job description.");
      return;
    }
    if (selectedFiles.length === 0) {
      showError("Please upload at least one resume file.");
      return;
    }

    // Build FormData
    const formData = new FormData();
    formData.append("job_description", jd);
    selectedFiles.forEach((file) => formData.append("resumes", file));

    setLoading(true);

    try {
      const response = await fetch("/api/screen", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        showError(data.error || "An unexpected error occurred.");
        setLoading(false);
        return;
      }

      // Store results and redirect
      sessionStorage.setItem("screeningResults", JSON.stringify(data));
      window.location.href = "/results";
    } catch (err) {
      console.error(err);
      showError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  });

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.classList.toggle("hidden", loading);
    btnLoader.classList.toggle("hidden", !loading);
  }

  function showError(message) {
    errorBanner.textContent = message;
    errorBanner.classList.remove("hidden");
    errorBanner.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function hideError() {
    errorBanner.classList.add("hidden");
    errorBanner.textContent = "";
  }
})();
