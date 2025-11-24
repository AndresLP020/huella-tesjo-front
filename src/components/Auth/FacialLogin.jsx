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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import { Face, CameraAlt, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';

export function FacialLoginDialog({ open, onClose, onSuccess, email }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState('');
  const { loginWithFacial } = useContext(AuthContext);

  useEffect(() => {
    let stream = null;

    const loadModels = async () => {
      try {
        setStatus('Cargando modelos de reconocimiento facial...');
        
        // Intentar cargar desde /models primero, si falla usar CDN alternativo
        let modelsLoaded = false;
        
        try {
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models')
          ]);
          modelsLoaded = true;
        } catch (localError) {
          console.warn('No se encontraron modelos locales, intentando cargar desde CDN...');
          
          // Intentar con diferentes URLs de CDN
          const cdnUrls = [
            'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights',
            'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights'
          ];
          
          for (const MODEL_URL of cdnUrls) {
            try {
              await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
              ]);
              modelsLoaded = true;
              console.log('Modelos cargados exitosamente desde:', MODEL_URL);
              break;
            } catch (cdnError) {
              console.warn('Error cargando desde', MODEL_URL, ':', cdnError);
              continue;
            }
          }
          
          if (!modelsLoaded) {
            throw new Error('No se pudieron cargar los modelos desde ninguna fuente');
          }
        }
        
        setModelsLoaded(true);
        setStatus('Modelos cargados. Posiciona tu rostro frente a la cámara.');
      } catch (err) {
        console.error('Error cargando modelos:', err);
        setError('Error al cargar modelos de reconocimiento facial. Por favor, verifica tu conexión a internet e intenta recargar la página.');
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

    if (open) {
      loadModels();
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [open]);

  const handleLogin = async () => {
    if (!email) {
      setError('Por favor, ingresa tu email primero');
      return;
    }

    if (!modelsLoaded) {
      setError('Los modelos aún se están cargando. Por favor espera.');
      return;
    }

    setLoading(true);
    setError('');
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

      setStatus('Verificando identidad...');

      // Convertir descriptor a array
      const descriptor = Array.from(detection.descriptor);

      // Intentar login con reconocimiento facial usando el contexto
      const result = await loginWithFacial(email, descriptor);

      if (result.success) {
        setStatus('¡Rostro reconocido! Iniciando sesión...');
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(result);
          }
          handleClose();
        }, 1000);
      } else {
        setError('Rostro no reconocido. Por favor, intenta de nuevo o usa tu contraseña.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error en login facial:', err);
      const errorMessage = err.response?.data?.message || 'Error al verificar tu rostro. Por favor, intenta de nuevo.';
      setError(errorMessage);
      setLoading(false);
      setStatus('');
    }
  };

  const handleClose = () => {
    setStatus('');
    setError('');
    setLoading(false);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Face />
        Iniciar Sesión con Reconocimiento Facial
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {status && !error && (
          <Alert 
            severity={status.includes('¡') ? 'success' : 'info'} 
            sx={{ mb: 2, borderRadius: 2 }}
            icon={status.includes('¡') ? <CheckCircle /> : <CameraAlt />}
          >
            {status}
          </Alert>
        )}

        <Box sx={{ 
          position: 'relative',
          width: '100%',
          bgcolor: 'grey.900',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 2
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

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Asegúrate de tener buena iluminación y estar frente a la cámara
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleLogin}
          variant="contained"
          disabled={loading || !modelsLoaded}
          startIcon={loading ? <CircularProgress size={16} /> : <Face />}
        >
          {loading ? 'Verificando...' : 'Iniciar Sesión'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

