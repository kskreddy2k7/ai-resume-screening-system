from flask import Flask, render_template, request
import os
import sqlite3
from datetime import datetime

from resume_parser import extract_text
from text_cleaner import clean_text
from job_matcher import calculate_match_score
def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT,
        score REAL,
        date TEXT
    )
    """)

    conn.commit()
    conn.close()
app = Flask(__name__)

UPLOAD_FOLDER = "resumes"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["resume"]
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)

    # Resume processing
    resume_text = extract_text(filepath)
    cleaned_resume = clean_text(resume_text)

    # Job description
    with open("job_descriptions/job.txt", "r") as f:
        job_text = f.read()

    cleaned_job = clean_text(job_text)

    # Match score
    score = calculate_match_score(cleaned_resume, cleaned_job)

    # 🔹 Send data to HTML
    return render_template(
        "result.html",
        score=score,
        filename=file.filename
    )
init_db()
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)