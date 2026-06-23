@echo off
REM Double-clique ce fichier pour publier une version BETA (licence requise).
REM 1) compile l'app en mode beta  2) publie en Release  3) SUPPRIME les anciennes versions
REM    (pour qu'un testeur ne puisse pas recuperer une vieille version sans licence).
echo === 1/2 : Compilation BETA (licence requise) ===
pushd "%~dp0..\Press Start\app"
py build.py --beta
popd
echo.
echo === 2/2 : Publication + nettoyage des anciennes versions ===
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0publier.ps1" -Nettoyer
