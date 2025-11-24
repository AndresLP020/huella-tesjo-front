# Modelos de Reconocimiento Facial

Para que el reconocimiento facial funcione correctamente, necesitas descargar los modelos de face-api.js.

## Pasos para instalar los modelos:

1. Descarga los modelos desde el repositorio oficial:
   - Ve a: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
   - Descarga los siguientes archivos:
     - `tiny_face_detector_model-weights_manifest.json`
     - `tiny_face_detector_model-shard1`
     - `face_landmark_68_model-weights_manifest.json`
     - `face_landmark_68_model-shard1`
     - `face_recognition_model-weights_manifest.json`
     - `face_recognition_model-shard1`
     - `face_recognition_model-shard2`

2. Crea la carpeta `models` en la carpeta `public`:
   ```
   huella-tesjo-front/public/models/
   ```

3. Coloca todos los archivos descargados en la carpeta `public/models/`

4. Reinicia el servidor de desarrollo

## Alternativa: Usar desde CDN

Si no puedes descargar los modelos localmente, la aplicación intentará cargarlos desde internet automáticamente. Sin embargo, esto puede ser más lento y requerir conexión a internet.

