@echo off
REM Script para descargar modelos de face-api.js en Windows
REM Uso: download-models.bat

echo 📥 Descargando modelos de face-api.js...
echo.

REM Crear directorio si no existe
if not exist "public\models" mkdir "public\models"

REM URL base de los modelos
set BASE_URL=https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights

REM Archivos a descargar
set FILES=tiny_face_detector_model-weights_manifest.json tiny_face_detector_model-shard1 face_landmark_68_model-weights_manifest.json face_landmark_68_model-shard1 face_recognition_model-weights_manifest.json face_recognition_model-shard1 face_recognition_model-shard2

set downloaded=0
set failed=0

for %%f in (%FILES%) do (
    if exist "public\models\%%f" (
        echo ⏭️  %%f ya existe, omitiendo...
        set /a downloaded+=1
    ) else (
        echo 📥 Descargando %%f...
        curl -L -o "public\models\%%f" "%BASE_URL%/%%f" --silent
        if !errorlevel! equ 0 (
            echo ✅ %%f descargado
            set /a downloaded+=1
        ) else (
            echo ❌ Error descargando %%f
            set /a failed+=1
        )
    )
)

echo.
echo 📊 Resumen:
echo    ✅ Descargados: %downloaded%
echo    ❌ Fallidos: %failed%

if %failed% equ 0 (
    echo.
    echo 🎉 ¡Todos los modelos se descargaron exitosamente!
    echo 📁 Ubicación: public\models\
) else (
    echo.
    echo ⚠️  Algunos archivos no se pudieron descargar. Intenta ejecutar el script nuevamente.
)

pause

