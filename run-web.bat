@echo off
title Vovinam Hoc Thuoc - Web Desktop App
echo ====================================================
echo   VOVINAM VIET VO DAO - HOC THUOC 10 CAU HOI
echo   Dang khoi chay ban Web tren may tinh...
echo ====================================================
echo.
start http://localhost:3000
npm run preview -- --port=3000 --host=0.0.0.0
pause
