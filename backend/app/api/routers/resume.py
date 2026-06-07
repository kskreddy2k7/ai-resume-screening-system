from fastapi import APIRouter, HTTPException, Depends
from app.models.resume import ResumeData, ResumeResponse
from app.db.mongodb import get_database
from typing import List
from datetime import datetime
import uuid

router = APIRouter()

# In a real app we'd use a Depends() to get the current user from the JWT
# Mocking it for now as a query parameter or simple passing
@router.post("/resumes/{user_id}", response_model=ResumeResponse)
async def create_resume(user_id: str, data: ResumeData, db=Depends(get_database)):
    resume_dict = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "data": data.dict(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db["resumes"].insert_one(resume_dict)
    return resume_dict

@router.get("/resumes/{user_id}", response_model=List[ResumeResponse])
async def get_resumes(user_id: str, db=Depends(get_database)):
    cursor = db["resumes"].find({"user_id": user_id})
    resumes = await cursor.to_list(length=100)
    return resumes

@router.get("/resume/{resume_id}", response_model=ResumeResponse)
async def get_resume(resume_id: str, db=Depends(get_database)):
    resume = await db["resumes"].find_one({"_id": resume_id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume
