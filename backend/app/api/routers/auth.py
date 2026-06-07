from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import UserCreate, UserLogin, UserResponse
from app.services.auth_service import get_password_hash, verify_password, create_access_token
from app.db.mongodb import get_database
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
async def signup(user: UserCreate, db=Depends(get_database)):
    existing_user = await db["users"].find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    user_dict = {
        "_id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    await db["users"].insert_one(user_dict)
    return user_dict

@router.post("/login")
async def login(user: UserLogin, db=Depends(get_database)):
    db_user = await db["users"].find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": db_user["email"], "id": db_user["_id"]})
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": db_user["_id"], "name": db_user["name"], "email": db_user["email"]}}
