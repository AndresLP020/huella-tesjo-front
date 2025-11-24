import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODELS_DIR = path.join(__dirname, 'public', 'models');
const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// Archivos de modelos necesarios
const MODEL_FILES = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

// Función para descargar un archivo
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Seguir redirecciones
        file.close();
        fs.unlinkSync(filepath);
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Error ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// Función principal
async function downloadModels() {
  console.log('📥 Descargando modelos de face-api.js...\n');
  
  // Crear directorio si no existe
  if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
    console.log(`✅ Creada carpeta: ${MODELS_DIR}\n`);
  }
  
  let downloaded = 0;
  let failed = 0;
  
  for (const filename of MODEL_FILES) {
    const url = `${BASE_URL}/${filename}`;
    const filepath = path.join(MODELS_DIR, filename);
    
    // Verificar si el archivo ya existe
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  ${filename} ya existe, omitiendo...`);
      downloaded++;
      continue;
    }
    
    try {
      process.stdout.write(`📥 Descargando ${filename}... `);
      await downloadFile(url, filepath);
      console.log('✅');
      downloaded++;
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Descargados: ${downloaded}`);
  console.log(`   ❌ Fallidos: ${failed}`);
  
  if (failed === 0) {
    console.log(`\n🎉 ¡Todos los modelos se descargaron exitosamente!`);
    console.log(`📁 Ubicación: ${MODELS_DIR}`);
  } else {
    console.log(`\n⚠️  Algunos archivos no se pudieron descargar. Intenta ejecutar el script nuevamente.`);
  }
}

// Ejecutar
downloadModels().catch(console.error);

