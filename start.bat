@echo off
title TrustEdge - Starting Servers...
color 0B
echo.
echo   ████████╗██████╗ ██╗   ██╗███████ ████████╗███████╗██████╗  ██████╗ ███████╗
echo   ╚══██╔══╝██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗██╔════╝ ██╔════╝
echo      ██║   ██████╔╝██║   ██║███████╗   ██║   █████╗  ██║  ██║██║  ███╗█████╗  
echo      ██║   ██╔══██╗██║   ██║╚════██║   ██║   ██╔══╝  ██║  ██║██║   ██║██╔══╝  
echo      ██║   ██║  ██║╚██████╔╝███████║   ██║   ███████╗██████╔╝╚██████╔╝███████╗
echo      ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝╚═════╝  ╚═════╝ ╚══════╝
echo.
echo   The Human Banking Platform
echo   ══════════════════════════════════════════════
echo.

:: Start backend server
echo   [1/2] Starting Backend Server (port 5000)...
cd /d "%~dp0server"
start "TrustEdge Backend" cmd /k "title TrustEdge Backend Server && color 0A && node server.js"

:: Wait for backend to initialize
timeout /t 3 /nobreak >nul

:: Start frontend dev server
echo   [2/2] Starting Frontend Server (port 3000)...
cd /d "%~dp0client"
start "TrustEdge Frontend" cmd /k "title TrustEdge Frontend Server && color 0D && npm run dev"

:: Wait and open browser
timeout /t 4 /nobreak >nul
echo.
echo   ✅ Both servers are running!
echo   ══════════════════════════════════════════════
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000
echo   ══════════════════════════════════════════════
echo.
echo   Opening browser...
start http://localhost:3000
echo.
echo   Press any key to close this window (servers keep running).
pause >nul
