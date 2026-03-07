"""
API Blueprint – all REST endpoints for the resume screening system.
"""
from __future__ import annotations

import os
import logging

from flask import Blueprint, request, jsonify, current_app

from backend.models.candidate import Candidate
from backend.services.resume_parser import extract_text
from backend.services.job_matcher import calculate_match
from backend.utils.file_handler import (
    allowed_file,
    secure_unique_filename,
    get_file_size_mb,
    ensure_upload_dir,
)

logger = logging.getLogger(__name__)
api_bp = Blueprint("api", __name__, url_prefix="/api")

MAX_FILE_SIZE_MB = 10


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _bad_request(message: str):
    return jsonify({"success": False, "error": message}), 400


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@api_bp.route("/screen", methods=["POST"])
def handle_screen_request():
    """
    POST /api/screen

    Accepts a multipart form with:
    - ``resumes``         : one or more resume files (PDF / DOCX / TXT)
    - ``job_description`` : the job description as plain text

    Returns a JSON list of ranked candidates.
    """
    # --- validate job description ---
    job_description = request.form.get("job_description", "").strip()
    if not job_description:
        return _bad_request("Job description is required.")

    # --- validate files ---
    files = request.files.getlist("resumes")
    if not files or all(f.filename == "" for f in files):
        return _bad_request("At least one resume file is required.")

    upload_folder = current_app.config["UPLOAD_FOLDER"]
    ensure_upload_dir(upload_folder)

    candidates: list[Candidate] = []

    for resume_file in files:
        if not resume_file or resume_file.filename == "":
            continue

        original_name = resume_file.filename
        if not allowed_file(original_name):
            logger.warning("Skipping unsupported file: %s", original_name)
            continue

        # Save to disk
        safe_name = secure_unique_filename(original_name)
        filepath = os.path.join(upload_folder, safe_name)
        resume_file.save(filepath)

        # Size guard (post-save to avoid streaming the whole file twice)
        if get_file_size_mb(filepath) > MAX_FILE_SIZE_MB:
            os.remove(filepath)
            logger.warning("File too large, skipped: %s", original_name)
            continue

        # Extract & match
        resume_text = extract_text(filepath)
        if not resume_text.strip():
            logger.warning("No text extracted from: %s", original_name)
            continue

        result = calculate_match(
            resume_raw=resume_text,
            job_raw=job_description,
            candidate_name=os.path.splitext(original_name)[0],
        )

        candidates.append(
            Candidate(
                filename=original_name,
                candidate_name=result["candidate"],
                score=result["score"],
                matched_skills=result["matched_skills"],
                missing_skills=result["missing_skills"],
                resume_skills=result["resume_skills"],
                job_skills=result["job_skills"],
            )
        )

    if not candidates:
        return _bad_request("No valid resumes could be processed.")

    # Rank by score descending
    ranked = sorted(candidates, key=lambda c: c.score, reverse=True)
    return jsonify({"success": True, "candidates": [c.to_dict() for c in ranked]})


@api_bp.route("/health", methods=["GET"])
def health_check():
    """GET /api/health – simple liveness probe."""
    return jsonify({"status": "ok", "service": "AI Resume Screening System"})
