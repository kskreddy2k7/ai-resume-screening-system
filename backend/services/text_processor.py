"""
Text pre-processing utilities: cleaning, stop-word removal, and skill extraction.
"""
import re
import logging

import nltk
from nltk.corpus import stopwords

logger = logging.getLogger(__name__)

# Ensure NLTK data is available (downloads only on first run)
for _resource in ("stopwords", "punkt"):
    try:
        nltk.data.find(f"tokenizers/{_resource}" if _resource == "punkt" else f"corpora/{_resource}")
    except LookupError:
        nltk.download(_resource, quiet=True)

_STOP_WORDS = set(stopwords.words("english"))

# ---------------------------------------------------------------------------
# Common tech / role skills used for keyword extraction
# ---------------------------------------------------------------------------
SKILL_KEYWORDS = {
    # Programming languages
    "python", "java", "javascript", "typescript", "c", "c++", "c#", "ruby",
    "go", "rust", "swift", "kotlin", "php", "scala", "r", "matlab",
    # Web / frameworks
    "react", "angular", "vue", "node", "nodejs", "django", "flask", "fastapi",
    "spring", "express", "html", "css", "html5", "css3", "bootstrap",
    # Data / ML
    "machine learning", "deep learning", "nlp", "natural language processing",
    "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy",
    "data science", "data analysis", "computer vision", "neural network",
    "bert", "gpt", "transformers",
    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle",
    "elasticsearch", "firebase",
    # Cloud / DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
    "ci/cd", "devops", "linux", "git", "github",
    # Other tech
    "rest", "api", "graphql", "microservices", "agile", "scrum",
    "unit testing", "test driven", "tdd",
}


def clean_text(text: str) -> str:
    """
    Lowercase, remove non-alpha characters, and strip English stop words.
    """
    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    words = text.split()
    words = [w for w in words if w not in _STOP_WORDS and len(w) > 1]
    return " ".join(words)


def extract_skills(text: str) -> list[str]:
    """
    Return a sorted list of known skills found in *text*.
    Matches are case-insensitive and respect word boundaries.
    """
    text_lower = text.lower()
    found: list[str] = []

    for skill in SKILL_KEYWORDS:
        # Use word-boundary search; multi-word skills are matched as substrings
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text_lower):
            found.append(skill)

    return sorted(found)
