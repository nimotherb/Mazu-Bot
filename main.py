import os
import json
import random
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
from lunar_python import Lunar, Solar


load_dotenv()


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY) if API_KEY else None


# Load the system prompt from SPEC.md
system_prompt_path = os.path.join(os.path.dirname(__file__), "..", "SPEC.md")
with open(system_prompt_path, "r", encoding="utf-8") as f:
    MAZU_SYSTEM_PROMPT = f.read()


# Load lottery JSON
lottery_path = os.path.join(os.path.dirname(__file__), "mazu_lottery.json")
