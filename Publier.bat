@echo off
REM Double-clique ce fichier pour publier une nouvelle version compilee.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0publier.ps1"
