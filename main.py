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
with open(lottery_path, "r", encoding="utf-8") as f:
    LOTTERY_DATA = json.load(f)

class ChatRequest(BaseModel):
    message: str
    user_data: dict

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

@app.post("/api/chat")
async def chat_with_mazu(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API key not configured. Please add GEMINI_API_KEY to backend/.env file.")
    try:
        # 1. 進行真實命理運算
        dob = request.user_data.get("birth_date", "")
        time = request.user_data.get("birth_time", "")
        astro_data = calculate_astrology(dob, time) if dob else {}
        
        # 2. 判斷是否需要抽籤 (關鍵字觸發)
        drawn_lottery = None
        user_msg = request.message
        if any(keyword in user_msg for keyword in ["抽籤", "求籤", "指引", "籤詩", "怎麼辦", "迷惘"]):
            drawn_lottery = random.choice(LOTTERY_DATA)
            
        # 3. 組合 Context 給 Gemini
        context = f"【使用者真實資料】: {request.user_data}\n"
        context += f"【系統後端精確計算之命盤資訊】: {astro_data}\n"
        if drawn_lottery:
            context += f"【後端抽籤系統已抽出真實籤詩】: (籤號: {drawn_lottery['name']}, 詩句: {drawn_lottery['poem']}, 歷史/白話意義: {drawn_lottery['meaning']})。請默姊姊針對這支具體的籤詩，用溫柔白話的方式為孩子解籤指迷津，絕對不可自己捏造其他籤。\n"
            
        context += f"\n【使用者當前話語】: {user_msg}"
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=context,
            config=types.GenerateContentConfig(
                system_instruction=MAZU_SYSTEM_PROMPT,
                temperature=0.7,
            )
        )
        return {"response": response.text}
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise HTTPException(status_code=500, detail="神明連線中斷，請稍後再試。")

# Mount frontend static files
app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
