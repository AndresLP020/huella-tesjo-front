import React, { useRef, useEffect, useState, useContext } from 'react';
import * as faceapi from 'face-api.js';
import { FacialService } from '../../services/facialService';
import { AuthContext } from '../../contexts/AuthContext';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Paper,
  useTheme
} from '@mui/material';
import { Face, CameraAlt, CheckCircle, Error as ErrorIcon, Refresh } from '@mui/icons-material';

export function FacialRegister() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);
  const { currentUser, updateUserProfile } = useContext(AuthContext);
  const theme = useTheme();

  useEffect(() => {
    let stream = null;

    const loadModels = async () => {
      try {
        setStatus('Cargando modelos de reconocimiento facial...');
        
        // Intentar cargar desde /models primero, si falla usar CDN alternativo
        let loaded = false;
        
        try {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models')
          ]);
          loaded = true;
          console.log('Modelos cargados desde carpeta local /models');
        } catch (localError) {
          console.warn('No se encontraron modelos locales, intentando cargar desde CDN...');
          
          // Intentar con diferentes URLs de CDN
          const cdnUrls = [
            'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights',
            'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights'
          ];
          
          for (const MODEL_URL of cdnUrls) {
            try {
              setStatus(`Cargando modelos desde internet... (${cdnUrls.indexOf(MODEL_URL) + 1}/${cdnUrls.length})`);
              await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
              ]);
              loaded = true;
              console.log('Modelos cargados exitosamente desde:', MODEL_URL);
              break;
            } catch (cdnError) {
              console.warn('Error cargando desde', MODEL_URL);
              continue;
            }
          }
        }
        
        if (!loaded) {
          throw new Error('No se pudieron cargar los modelos desde ninguna fuente');
        }
        
        setModelsLoaded(true);
        setStatus('Modelos cargados. Posiciona tu rostro frente a la cámara.');
      } catch (err) {
        console.error('Error cargando modelos:', err);
        setError('Error al cargar modelos de reconocimiento facial. Los modelos se están cargando desde internet. Si el problema persiste, puedes descargar los modelos manualmente desde https://github.com/justadudewhohacks/face-api.js/tree/master/weights y colocarlos en la carpeta /public/models de tu proyecto. Ver README_MODELS.md para más información.');
        setStatus('');
      }
    };

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640, 
            height: 480,
            facingMode: 'user' // Cámara frontal
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accediendo a la cámara:', err);
        setError('No se pudo acceder a la cámara. Por favor, permite el acceso a la cámara.');
        setStatus('');
      }
    };

    const checkIfRegistered = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await FacialService.getDescriptor(token);
            if (response.data && response.data.descriptor) {
              setHasRegistered(true);
            }
          } catch (err) {
            // Si hay error 404 o 401, significa que no está registrado
            if (err.response?.status === 404 || err.response?.status === 401) {
              setHasRegistered(false);
            } else {
              // Otro error, no cambiar el estado
              console.warn('Error verificando descriptor:', err);
            }
          }
        } else {
          setHasRegistered(false);
        }
      } catch (err) {
        // Si no hay descriptor, no está registrado
        setHasRegistered(false);
      }
    };

    loadModels();
    startCamera();
    checkIfRegistered();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleRegister = async () => {
    if (!modelsLoaded) {
      setError('Los modelos aún se están cargando. Por favor espera.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setStatus('Detectando rostro...');

    try {
      // Detectar rostro y obtener descriptor
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setError('No se detectó ningún rostro. Por favor, asegúrate de estar frente a la cámara con buena iluminación.');
        setLoading(false);
        return;
      }

      setStatus('Registrando tu rostro...');

      // Convertir descriptor a array
      const descriptor = Array.from(detection.descriptor);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay sesión activa. Por favor, inicia sesión primero.');
        setLoading(false);
        return;
      }

      // Registrar descriptor
      await FacialService.registerDescriptor(descriptor, token);

      setStatus('¡Rostro registrado exitosamente!');
      setSuccess(true);
      setHasRegistered(true);
      
      // Actualizar perfil del usuario
      if (updateUserProfile) {
        await updateUserProfile();
      }

      setTimeout(() => {
        setStatus('');
      }, 3000);
    } catch (err) {
      console.error('Error registrando rostro:', err);
      const errorMessage = err.response?.data?.message || 'Error al registrar tu rostro. Por favor, intenta de nuevo.';
      setError(errorMessage);
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  if (hasRegistered) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[2] }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom color="success.main">
              Reconocimiento Facial Registrado
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Tu rostro ha sido registrado exitosamente. Ahora puedes iniciar sesión usando reconocimiento facial.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                setHasRegistered(false);
                setSuccess(false);
                setError('');
                setStatus('');
              }}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Registrar Nuevamente
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: theme.shadows[2] }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Face />
            Registro de Reconocimiento Facial
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registra tu rostro para poder iniciar sesión de forma rápida y segura sin necesidad de contraseña.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {status || '¡Rostro registrado exitosamente!'}
          </Alert>
        )}

        {status && !error && !success && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
            {status}
          </Alert>
        )}

        <Box sx={{ 
          position: 'relative',
          width: '100%',
          bgcolor: 'grey.900',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 3
        }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
          {loading && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.5)'
            }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Asegúrate de tener buena iluminación y estar frente a la cámara
        </Typography>

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleRegister}
          disabled={loading || !modelsLoaded}
          startIcon={loading ? <CircularProgress size={16} /> : <CameraAlt />}
          sx={{
            borderRadius: 2,
            py: 1.5,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
            }
          }}
        >
          {loading ? 'Registrando...' : 'Registrar Mi Rostro'}
        </Button>

        <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
          <Typography variant="body2">
            <strong>Seguridad:</strong> Tu información facial se almacena de forma segura y solo se usa para verificar tu identidad.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}

