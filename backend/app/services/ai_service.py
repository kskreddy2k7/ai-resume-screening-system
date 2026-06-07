import spacy
from sentence_transformers import SentenceTransformer, util
import numpy as np
import re

class AIEngine:
    def __init__(self):
        print("Loading NLP models. This might take a moment...")
        # Load spaCy for NER and tokenization
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except Exception as e:
            print(f"Warning: Could not load spacy model directly. {e}")
            self.nlp = None

        # Load sentence transformer
        self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
        print("Models loaded successfully.")

        # Common tech skills dictionary for basic extraction
        self.skill_db = {
            "python", "javascript", "react", "typescript", "node.js", "java",
            "c++", "c#", "aws", "docker", "kubernetes", "sql", "postgresql",
            "mongodb", "machine learning", "fastapi", "django", "flask"
        }

    def extract_skills(self, text: str) -> list[str]:
        """
        Extract skills from text using a combination of NLP and matching.
        """
        text_lower = text.lower()
        found_skills = set()
        
        # Simple dictionary match for speed and accuracy on known tech
        for skill in self.skill_db:
            # Using regex for word boundary to avoid partial matches
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                found_skills.add(skill)
        
        # We can add spaCy based extraction for more complex noun chunks here if needed
        return list(found_skills)

    def calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Compute cosine similarity between two texts.
        """
        if not text1 or not text2:
            return 0.0

        embeddings1 = self.encoder.encode([text1])
        embeddings2 = self.encoder.encode([text2])
        
        # Compute cosine similarity
        cosine_scores = util.cos_sim(embeddings1, embeddings2)
        score = float(cosine_scores[0][0])
        
        # Normalize to 0-1 range roughly, as negative is extremely dissimilar
        return max(0.0, score)

ai_engine = AIEngine()
