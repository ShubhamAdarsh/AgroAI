from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from core.orchestrator import run_crop_pipeline
from utils.db import mongo
from datetime import datetime, timezone, timedelta

from fastapi.middleware.cors import CORSMiddleware

import bcrypt
import jwt

app = FastAPI()

# 🔐 SECRET KEY (move to env in production)
SECRET = "supersecretkey"

# 🌐 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 📦 MODELS
# =========================

class CropRequest(BaseModel):
    task: str

class AuthRequest(BaseModel):
    email: str
    password: str
    role: str = "worker"

class AvailabilityRequest(BaseModel):
    available: bool


# =========================
# 🔐 AUTH FUNCTIONS
# =========================

def create_token(email: str):
    payload = {
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=1)
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")

def get_current_user(request: Request):
    token = request.headers.get("Authorization")

    if not token:
        raise HTTPException(status_code=401, detail="No token provided")

    try:
        token = token.split(" ")[1]
        data = jwt.decode(token, SECRET, algorithms=["HS256"])
        return data["email"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


# =========================
# 🏠 HOME
# =========================

@app.get("/")
def home():
    return {"message": "Multi-Agent AI API Running 🚀"}


# =========================
# 🌾 CROP RECOMMENDATION (SECURED)
# =========================

@app.post("/recommend")
def get_recommendation(request: CropRequest, req: Request):
    email = get_current_user(req)  # 🔐 identify user

    result = run_crop_pipeline(request.task)

    crop_raw = result.get("crop", "")

    # 🧹 Clean crop name
    clean_crop = (
        crop_raw.replace("{", "")
        .replace("}", "")
        .replace('"', "")
        .replace("'", "")
        .split(",")[0]
        .strip()
    )

    mongo.insert("history", {
        "email": email,
        "task": request.task,
        "recommended_crop": clean_crop,
        "reason": result.get("reason"),
        "created_at": datetime.now(timezone.utc).isoformat()
    })

    return {
        "status": "success",
        "data": result
    }


# =========================
# 📜 HISTORY (USER-SPECIFIC)
# =========================

@app.get("/history")
def get_history(req: Request):
    email = get_current_user(req)

    data = mongo.find("history", {"email": email})

    for item in data:
        item["_id"] = str(item["_id"])

    return {"data": data}


# =========================
# 📝 SIGNUP
# =========================

@app.post("/signup")
def signup(req: AuthRequest):
    existing = mongo.find_one("users", {"email": req.email})

    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt())

    mongo.insert("users", {
        "email": req.email,
        "password": hashed.decode(),
        "role": req.role
    })

    token = create_token(req.email)

    return {
        "token": token,
        "role": req.role
    }


# =========================
# 🔑 LOGIN
# =========================

@app.post("/login")
def login(req: AuthRequest):
    user = mongo.find_one("users", {"email": req.email})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not bcrypt.checkpw(req.password.encode(), user["password"].encode()):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_token(req.email)

    return {
        "token": token,
        "role": user.get("role", "worker")
    }


# =========================
# 🟢 AVAILABILITY (SECURED + UPSERT)
# =========================

@app.post("/availability")
def update_availability(req: AvailabilityRequest, request: Request):
    email = get_current_user(request)

    status = req.available

    existing = mongo.find_one("workers", {"email": email})

    if existing:
        mongo.update("workers", {"email": email}, {
            "available": status
        })
    else:
        mongo.insert("workers", {
            "email": email,
            "available": status
        })

    return {"message": "Availability updated ✅"}
# =========================
# 👨‍🌾 SAVE WORKER PROFILE
# =========================

@app.post("/worker-profile")
def save_worker_profile(req: dict, request: Request):
    email = get_current_user(request)

    name = req.get("name")
    location = req.get("location")
    skills = req.get("skills", [])

    if not name or not location:
        raise HTTPException(status_code=400, detail="Missing fields")

    # 🔍 check if exists
    existing = mongo.find_one("workers", {"email": email})

    if existing:
        mongo.update("workers", {"email": email}, {
            "email": email,
            "name": name,
            "location": location,
            "skills": skills,
        })
    else:
        mongo.insert("workers", {
            "email": email,
            "name": name,
            "location": location,
            "skills": skills,
            "available": False
        })

    return {"message": "Profile saved successfully ✅"}

# =========================
# 👤 GET CURRENT WORKER
# =========================
@app.get("/me")
def get_me(request: Request):
    email = get_current_user(request)

    worker = mongo.find_one("workers", {"email": email})

    if worker:
        worker["_id"] = str(worker["_id"])
        return worker

    return {"email": email, "available": False}

# =========================
# 👷 GET AVAILABLE WORKERS
# =========================
@app.get("/workers")
def get_workers(request: Request):
    # 🔐 ensure user is logged in
    get_current_user(request)

    workers = mongo.find("workers", {"available": True})

    # 🔧 fix ObjectId
    for w in workers:
        w["_id"] = str(w["_id"])

    return {"data": workers}