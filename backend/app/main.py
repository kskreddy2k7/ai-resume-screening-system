from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongodb import connect_to_mongo, close_mongo_connection
from app.api.routers import analyze, resume, export, auth

app = FastAPI(title="TalentFlow AI Backend", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(resume.router, prefix="/api", tags=["resume"])
app.include_router(export.router, prefix="/api", tags=["export"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/")
def root():
    return {"message": "Welcome to TalentFlow AI API"}

