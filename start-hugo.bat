@echo off
powershell -Command "Remove-Item -Recurse -Force .\public\ -ErrorAction SilentlyContinue"
powershell -Command "Remove-Item -Recurse -Force .\resources\ -ErrorAction SilentlyContinue"
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "& '%~dp0start-hugo.ps1'"