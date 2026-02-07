@echo off
cd backend
echo Starting FastAPI backend server...
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause