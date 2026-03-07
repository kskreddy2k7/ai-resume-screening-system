"""
Job-matching service.

Calculates a similarity score between a resume and a job description using
TF-IDF + cosine similarity, and enriches the result with skill-overlap data.
"""
from __future__ import annotations

import logging
from typing import Any

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from backend.services.text_processor import clean_text, extract_skills

logger = logging.getLogger(__name__)


def calculate_match(
    resume_raw: str,
    job_raw: str,
    candidate_name: str = "Candidate",
) -> dict[str, Any]:
    """
    Compute a TF-IDF cosine similarity score and extract matched/missing skills.

    Parameters
    ----------
    resume_raw:
        Raw text extracted from the resume.
    job_raw:
        Raw text of the job description.
    candidate_name:
        Display name for the candidate (usually the filename).

    Returns
    -------
    dict with keys:
        - candidate      : display name
        - score          : match percentage (0-100, rounded to 2 dp)
        - matched_skills : list of skills present in both
        - missing_skills : list of job-required skills absent from resume
        - resume_skills  : all skills detected in the resume
        - job_skills     : all skills detected in the job description
    """
    resume_clean = clean_text(resume_raw)
    job_clean = clean_text(job_raw)

    # TF-IDF cosine similarity
    score = 0.0
    try:
        if resume_clean.strip() and job_clean.strip():
            vectorizer = TfidfVectorizer()
            vectors = vectorizer.fit_transform([resume_clean, job_clean])
            similarity = cosine_similarity(vectors[0], vectors[1])
            score = round(float(similarity[0][0]) * 100, 2)
    except Exception as exc:  # noqa: BLE001
        logger.error("TF-IDF calculation failed: %s", exc)

    # Skill analysis
    resume_skills = set(extract_skills(resume_raw))
    job_skills = set(extract_skills(job_raw))
    matched_skills = sorted(resume_skills & job_skills)
    missing_skills = sorted(job_skills - resume_skills)

    return {
        "candidate": candidate_name,
        "score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "resume_skills": sorted(resume_skills),
        "job_skills": sorted(job_skills),
    }
