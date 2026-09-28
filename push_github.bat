@echo off
cd /d "%~dp0"
set "PATH=C:\Users\hp\AppData\Local\Programs\Git\bin;C:\Users\hp\AppData\Local\Programs\Git\libexec\git-core;%PATH%"
echo ==============================================
echo  Envoi du projet SHAKPOT vers GitHub...
echo ==============================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ==============================================
    echo [SUCCES] Projet publie sur GitHub avec succes !
    echo Vous pouvez retourner sur Netlify et cliquer sur Shakpot.
    echo ==============================================
) else (
    echo [ATTENTION] Une erreur s'est produite lors de l'authentification.
)
echo.
pause
