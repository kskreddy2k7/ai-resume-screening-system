"""
Resume text extraction service.
Supports PDF, DOCX, and plain-text files.
"""
import os
import logging

logger = logging.getLogger(__name__)


def extract_text(filepath: str) -> str:
    """
    Extract plain text from a resume file.

    Supports .pdf, .docx / .doc, and .txt formats.
    Returns an empty string on failure and logs the error.
    """
    ext = os.path.splitext(filepath)[1].lower()

    try:
        if ext == ".pdf":
            return _extract_from_pdf(filepath)
        elif ext in (".docx", ".doc"):
            return _extract_from_docx(filepath)
        elif ext == ".txt":
            return _extract_from_txt(filepath)
        else:
            logger.warning("Unsupported file type: %s", ext)
            return ""
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to extract text from %s: %s", filepath, exc)
        return ""


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def _extract_from_pdf(filepath: str) -> str:
    """Extract text from a PDF file using PyPDF2."""
    import PyPDF2  # noqa: PLC0415 – lazy import keeps startup fast

    text_parts = []
    with open(filepath, "rb") as fh:
        reader = PyPDF2.PdfReader(fh)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def _extract_from_docx(filepath: str) -> str:
    """Extract text from a DOCX file using python-docx."""
    import docx  # noqa: PLC0415

    doc = docx.Document(filepath)
    paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
    return "\n".join(paragraphs)


def _extract_from_txt(filepath: str) -> str:
    """Read a plain-text file."""
    with open(filepath, "r", encoding="utf-8", errors="ignore") as fh:
        return fh.read()
