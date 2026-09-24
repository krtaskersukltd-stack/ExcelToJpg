@echo off
title Excel Converter Backend API
echo Starting Excel to Image Converter FastAPI Backend...
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause
