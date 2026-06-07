from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class Experience(BaseModel):
    company: str
    role: str
    duration: str
    responsibilities: str

class Education(BaseModel):
    college: str
    degree: str
    cgpa: str
    year: str

class ResumeData(BaseModel):
    personal: dict
    summary: Optional[str] = None
    experience: List[Experience] = []
    education: List[Education] = []
    skills: Optional[str] = None

class ResumeResponse(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    data: ResumeData
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}
