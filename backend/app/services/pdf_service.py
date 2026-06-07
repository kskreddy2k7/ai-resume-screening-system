import fitz  # PyMuPDF
import io

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from a PDF file byte stream using PyMuPDF.
    """
    try:
        # Open the PDF from bytes
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            # Extract text preserving layout reasonably well
            text += page.get_text("text") + "\n"
        doc.close()
        return text
    except Exception as e:
        raise Exception(f"Failed to extract text from PDF: {str(e)}")
