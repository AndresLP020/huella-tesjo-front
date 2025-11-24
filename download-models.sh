#!/bin/bash

# Script para descargar modelos de face-api.js
# Uso: bash download-models.sh

echo "📥 Descargando modelos de face-api.js..."
echo ""

# Crear directorio si no existe
mkdir -p public/models

# URL base de los modelos
BASE_URL="https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# Archivos a descargar
FILES=(
  "tiny_face_detector_model-weights_manifest.json"
  "tiny_face_detector_model-shard1"
  "face_landmark_68_model-weights_manifest.json"
  "face_landmark_68_model-shard1"
  "face_recognition_model-weights_manifest.json"
  "face_recognition_model-shard1"
  "face_recognition_model-shard2"
)

downloaded=0
failed=0

for file in "${FILES[@]}"; do
  if [ -f "public/models/$file" ]; then
    echo "⏭️  $file ya existe, omitiendo..."
    ((downloaded++))
  else
    echo -n "📥 Descargando $file... "
    if curl -L -o "public/models/$file" "$BASE_URL/$file" --silent --show-error; then
      echo "✅"
      ((downloaded++))
    else
      echo "❌"
      ((failed++))
    fi
  fi
done

echo ""
echo "📊 Resumen:"
echo "   ✅ Descargados: $downloaded"
echo "   ❌ Fallidos: $failed"

if [ $failed -eq 0 ]; then
  echo ""
  echo "🎉 ¡Todos los modelos se descargaron exitosamente!"
  echo "📁 Ubicación: public/models/"
else
  echo ""
  echo "⚠️  Algunos archivos no se pudieron descargar. Intenta ejecutar el script nuevamente."
fi

