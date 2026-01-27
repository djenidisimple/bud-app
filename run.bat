@echo off
title Lancement des serveurs Laravel et Next.js
color 0A

REM Obtention du chemin du script actuel
set "SCRIPT_PATH=%~dp0"

REM Configuration des chemins relatifs
set BACKEND_DIR=%SCRIPT_PATH%backend
set FRONTEND_DIR=%SCRIPT_PATH%frontend
set FRONTEND_PORT=3000
set BACKEND_PORT=8000

REM Vérification de l'existence des dossiers
echo Vérification des dossiers...
echo Backend: %BACKEND_DIR%
echo Frontend: %FRONTEND_DIR%
echo.

if not exist "%BACKEND_DIR%" (
    echo ERREUR: Dossier backend introuvable
    echo Chemin recherché: %BACKEND_DIR%
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%" (
    echo ERREUR: Dossier frontend introuvable
    echo Chemin recherché: %FRONTEND_DIR%
    pause
    exit /b 1
)

echo -----------------------------------------------
echo  Démarrage du serveur Laravel (port %BACKEND_PORT%)
echo -----------------------------------------------
start "Laravel Server" cmd /c "cd /d "%BACKEND_DIR%" && php artisan serve --port=%BACKEND_PORT%"

echo.
echo -----------------------------------------------
echo  Démarrage du serveur Next.js (port %FRONTEND_PORT%)
echo -----------------------------------------------
start "Next.js Server" cmd /c "cd /d "%FRONTEND_DIR%" && npm run dev"

echo.
echo Attente du démarrage du serveur Next.js (10 secondes)...
timeout /t 60 /nobreak >nul

echo.
echo -----------------------------------------------
echo  Ouverture du navigateur: http://localhost:%FRONTEND_PORT%
echo -----------------------------------------------
start "" "http://localhost:%FRONTEND_PORT%/budget/dashboard"

echo Les serveurs sont en cours d'exécution...
echo - Laravel: http://localhost:%BACKEND_PORT%
echo - Next.js: http://localhost:%FRONTEND_PORT%
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
033 69 405 53