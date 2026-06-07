from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Optional
from app.services.pdf_service import extract_text_from_pdf
from app.services.ai_service import ai_engine
import json

router = APIRouter()

@router.post("/analyze/resume")
async def analyze_resume(file: UploadFile = File(...)):
    """
    Endpoint to upload a PDF resume, parse it, and return basic AI extraction (skills, completeness).
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are currently supported")

    content = await file.read()
    
    try:
        text = extract_text_from_pdf(content)
        skills = ai_engine.extract_skills(text)
        
        # Simple scoring heuristic for ATS based on length and extracted skills
        word_count = len(text.split())
        completeness = min(100, int((word_count / 300) * 50) + min(50, len(skills) * 5))
        
        return {
            "filename": file.filename,
            "extracted_text_preview": text[:500] + "...",
            "skills_detected": skills,
            "completeness_score": completeness,
            "ats_score": max(40, completeness - 10) # Mock ATS based on completeness
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/match")
async def analyze_match(job_description: str = Form(...), file: UploadFile = File(...)):
    """
    Endpoint to score a resume against a specific job description.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are currently supported")

    content = await file.read()
    
    try:
        resume_text = extract_text_from_pdf(content)
        
        # Extract skills
        resume_skills = set(ai_engine.extract_skills(resume_text))
        jd_skills = set(ai_engine.extract_skills(job_description))
        
        missing_skills = list(jd_skills - resume_skills)
        matched_skills = list(jd_skills & resume_skills)
        
        # Calculate semantic similarity between full text
        similarity = ai_engine.calculate_similarity(resume_text, job_description)
        match_percentage = min(100, max(0, int(similarity * 100)))

        # Determine Category
        if match_percentage > 80:
            category = "Strong Hire"
        elif match_percentage > 65:
            category = "Hire"
        elif match_percentage > 50:
            category = "Consider"
        else:
            category = "Reject"

        return {
            "match_score": match_percentage,
            "category": category,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "semantic_similarity": similarity
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
