"""
Candidate data model (lightweight dataclass, no ORM dependency).
"""
from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class Candidate:
    """Represents a screened candidate and their match result."""

    filename: str
    candidate_name: str
    score: float
    matched_skills: list[str] = field(default_factory=list)
    missing_skills: list[str] = field(default_factory=list)
    resume_skills: list[str] = field(default_factory=list)
    job_skills: list[str] = field(default_factory=list)

    # Derived helpers --------------------------------------------------------

    @property
    def rank_label(self) -> str:
        """Return a human-readable rank label based on the score."""
        if self.score >= 75:
            return "Excellent"
        if self.score >= 50:
            return "Good"
        if self.score >= 25:
            return "Fair"
        return "Low"

    @property
    def score_color(self) -> str:
        """Return a CSS colour class that matches the rank."""
        return {
            "Excellent": "success",
            "Good": "info",
            "Fair": "warning",
            "Low": "danger",
        }[self.rank_label]

    def to_dict(self) -> dict:
        """Serialise to a plain dictionary (JSON-safe)."""
        return {
            "filename": self.filename,
            "candidate_name": self.candidate_name,
            "score": self.score,
            "rank_label": self.rank_label,
            "score_color": self.score_color,
            "matched_skills": self.matched_skills,
            "missing_skills": self.missing_skills,
            "resume_skills": self.resume_skills,
            "job_skills": self.job_skills,
        }
