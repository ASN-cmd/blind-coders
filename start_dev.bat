@echo off
echo Starting Backend (Flask on port 5000)...
start cmd /k "cd backend && python app.py"

echo Starting Frontend (Next.js on port 3000)...
cd frontend
timeout /t 5
choice /m "Install dependencies first? (Only needed first time)"
if errorlevel 2 goto run
if errorlevel 1 npm install

:run
npm run dev
pomse
