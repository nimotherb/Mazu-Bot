@echo off
echo ==============================================
echo       蓬萊 (PENGLAI) - 媽祖陪伴機器人 MVP
echo ==============================================
echo.
echo 啟動前端伺服器 (Port: 3000)...
start cmd /k "cd frontend && python -m http.server 3000"

echo 啟動後端伺服器 (Port: 8000)...
start cmd /c "cd backend && call venv\Scripts\activate.bat && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo 伺服器已啟動！
echo 前端頁面位址: http://localhost:3000
echo 後端 API 位址: http://localhost:8000
pause
