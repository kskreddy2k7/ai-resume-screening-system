from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from app.db.mongodb import get_database
from fpdf import FPDF
import io

router = APIRouter()

@router.get("/resumes/{resume_id}/export/pdf")
async def export_resume_pdf(resume_id: str, db=Depends(get_database)):
    resume = await db["resumes"].find_one({"_id": resume_id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    data = resume["data"]
    
    # Generate PDF using fpdf2
    pdf = FPDF()
    pdf.add_page()
    
    # Fonts
    pdf.set_font("Helvetica", "B", 24)
    pdf.cell(0, 10, data["personal"].get("name", "Unknown"), ln=True, align="C")
    
    pdf.set_font("Helvetica", "", 10)
    contact_info = f"{data['personal'].get('email', '')} | {data['personal'].get('phone', '')} | {data['personal'].get('location', '')}"
    pdf.cell(0, 10, contact_info, ln=True, align="C")
    
    pdf.ln(5)
    
    if data.get("summary"):
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "Summary", ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(0, 6, data["summary"])
        pdf.ln(5)

    if data.get("experience"):
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "Experience", ln=True)
        for exp in data["experience"]:
            pdf.set_font("Helvetica", "B", 12)
            pdf.cell(0, 6, exp["role"], ln=True)
            pdf.set_font("Helvetica", "I", 10)
            pdf.cell(0, 6, f"{exp['company']} | {exp['duration']}", ln=True)
            pdf.set_font("Helvetica", "", 10)
            pdf.multi_cell(0, 6, exp["responsibilities"])
            pdf.ln(3)

    if data.get("education"):
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "Education", ln=True)
        for edu in data["education"]:
            pdf.set_font("Helvetica", "B", 12)
            pdf.cell(0, 6, edu["degree"], ln=True)
            pdf.set_font("Helvetica", "", 10)
            pdf.cell(0, 6, f"{edu['college']} | {edu['year']} | CGPA: {edu['cgpa']}", ln=True)
            pdf.ln(3)

    if data.get("skills"):
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "Skills", ln=True)
        pdf.set_font("Helvetica", "", 10)
        pdf.multi_cell(0, 6, data["skills"])

    pdf_bytes = pdf.output()

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={data['personal'].get('name', 'resume')}_resume.pdf"
        }
    )
