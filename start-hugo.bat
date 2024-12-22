@echo off
@echo Public remove
powershell -Command "Remove-Item -Recurse -Force .\public\ -ErrorAction SilentlyContinue"
@echo resources remove
powershell -Command "Remove-Item -Recurse -Force .\resources\ -ErrorAction SilentlyContinue"
@echo Get IP and start Hugo
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "& '%~dp0start-hugo.ps1'"