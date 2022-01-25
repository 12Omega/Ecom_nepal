@echo off
echo ========================================
echo XSS Vulnerability Test - Quick Start
echo ========================================
echo.

echo Step 1: Starting the server...
echo.
start cmd /k "cd /d %~dp0 && npm start"

timeout /t 5 /nobreak >nul

echo Step 2: Running XSS test script...
echo.
node test-xss-profile.js

echo.
echo ========================================
echo Test Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Copy the User ID from above
echo 2. Open xss-demo.html in your browser
echo 3. Enter the User ID and click "Load Profile"
echo 4. Watch for alert boxes!
echo.
echo Or visit: http://localhost:3000/profile/USER_ID
echo.
pause
