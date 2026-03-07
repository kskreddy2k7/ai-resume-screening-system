"""
Utility functions for file handling and validation.
"""
import os
import uuid

ALLOWED_EXTENSIONS = {"pdf", "docx", "doc", "txt"}
MAX_FILE_SIZE_MB = 10


def allowed_file(filename: str) -> bool:
    """Check if a file has an allowed extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def secure_unique_filename(original_filename: str) -> str:
    """Generate a secure unique filename while preserving the extension."""
    ext = original_filename.rsplit(".", 1)[1].lower() if "." in original_filename else "bin"
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    return unique_name


def get_file_size_mb(filepath: str) -> float:
    """Return the file size in megabytes."""
    return os.path.getsize(filepath) / (1024 * 1024)


def ensure_upload_dir(upload_folder: str) -> None:
    """Create the upload directory if it does not exist."""
    os.makedirs(upload_folder, exist_ok=True)
