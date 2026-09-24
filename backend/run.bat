@echo off
title Excel Converter Backend API
echo Starting Excel to Image Converter FastAPI Backend...
where uv >nul 2>nul
if %errorlevel%==0 (
  uv run --no-project --with-requirements requirements.txt python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
) else (
  py -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
)
pause
