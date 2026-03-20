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

base_dir = os.path.dirname(os.path.abspath(__file__))

# Load the system prompt from SPEC.md (Handle both local and flattened Sandbox structures)
spec_path_flat = os.path.join(base_dir, "SPEC.md")
spec_path_local = os.path.join(base_dir, "..", "SPEC.md")
system_prompt_path = spec_path_flat if os.path.exists(spec_path_flat) else spec_path_local

with open(system_prompt_path, "r", encoding="utf-8") as f:
    MAZU_SYSTEM_PROMPT = f.read()

# Load lottery JSON
lottery_path_flat = os.path.join(base_dir, "mazu_lottery.json")
lottery_path = lottery_path_flat if os.path.exists(lottery_path_flat) else os.path.join(base_dir, "..", "mazu_lottery.json")

with open(lottery_path, "r", encoding="utf-8") as f:
    LOTTERY_DATA = json.load(f)

from typing import Optional

class ChatRequest(BaseModel):
    message: str
    user_data: dict
    fortune_context: Optional[str] = None

def get_zodiac_sign(month: int, day: int) -> str:
    zodiac_dates = [
        (1, 20, "水瓶座"), (2, 19, "雙魚座"), (3, 21, "牡羊座"), (4, 20, "金牛座"),
        (5, 21, "雙子座"), (6, 22, "巨蟹座"), (7, 23, "獅子座"), (8, 23, "處女座"),
        (9, 23, "天秤座"), (10, 24, "天蠍座"), (11, 22, "射手座"), (12, 22, "摩羯座")
    ]
    for m, d, name in zodiac_dates:
        if (month == m and day >= d) or (month == m + 1 and day < zodiac_dates[(m) % 12][1]):
            return name
        if month == 12 and day >= 22: return "摩羯座"
        if month == 1 and day <= 19: return "摩羯座"
    return "未知星座"

def calculate_astrology(dob_str: str, time_str: str) -> dict:
    try:
        dt = datetime.strptime(dob_str, "%Y-%m-%d")
        solar = Solar.fromYmd(dt.year, dt.month, dt.day)
        lunar = Lunar.fromSolar(solar)
        
        bazi = f"{lunar.getYearInGanZhi()}年 {lunar.getMonthInGanZhi()}月 {lunar.getDayInGanZhi()}日"
        zodiac = get_zodiac_sign(dt.month, dt.day)
        return {
            "農曆": f"{lunar.getYear()}年 {lunar.getMonthInChinese()}月 {lunar.getDayInChinese()}",
            "八字 (天干地支)": bazi,
            "太陽星座": zodiac
        }
    except Exception as e:
        return {"error": "生日格式解析錯誤，無法計算命盤"}

@app.get("/api/lottery")
async def get_lottery_db():
    return LOTTERY_DATA

@app.post("/api/chat")
async def chat_with_mazu(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API key not configured. Please add GEMINI_API_KEY to backend/.env file.")
    try:
        dob = request.user_data.get("birth_date", "")
        time = request.user_data.get("birth_time", "")
        astro_data = calculate_astrology(dob, time) if dob else {}
        
        context = f"【請求者的天地四象與靈魂資料】: {request.user_data}\n"
        context += f"【命理推算】: {astro_data}\n"
        
        if request.fortune_context:
            context += f"\n【信徒已求得籤詩指示】: {request.fortune_context}\n此籤為信徒經歷嚴謹擲筊儀式求得。請化身為『默』，用滿滿的情緒價值與溫暖的肯定言詞，針對這支籤的吉凶、幸運色、方位與禁忌，給予信徒生活上的情感共鳴與指引。不要透露這是系統設定，要說是宇宙或緣分的指引。\n"
            
        context += f"\n【信徒當前話語】: {request.message}"
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=context,
            config=types.GenerateContentConfig(
                system_instruction=MAZU_SYSTEM_PROMPT,
                temperature=0.85,
            )
        )
        return {"response": response.text}
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise HTTPException(status_code=500, detail="神明連線中斷，請稍後再試。")

# Mount frontend static files
frontend_dir_local = os.path.join(base_dir, "..", "frontend")
frontend_dir_flat = base_dir
frontend_dir = frontend_dir_local if os.path.isdir(frontend_dir_local) else frontend_dir_flat

app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
