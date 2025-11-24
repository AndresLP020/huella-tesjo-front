import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { FacialService } from '../../services/facialService';

export function FacialRegister({ token }) {
  const videoRef = useRef();
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function loadModels() {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    }
    loadModels();
  }, []);

  const handleRegister = async () => {
    setStatus('Capturando rostro...');
    const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    if (!detection) {
      setStatus('No se detectó rostro.');
      return;
    }
    setStatus('Registrando descriptor...');
    try {
      await FacialService.registerDescriptor(Array.from(detection.descriptor), token);
      setStatus('Rostro registrado correctamente.');
    } catch (err) {
      setStatus('Error al registrar rostro.');
    }
  };

  return (
    <div>
      <h3>Registro facial</h3>
      <video ref={videoRef} autoPlay width={320} height={240} style={{ border: '1px solid #ccc' }} />
      <button onClick={handleRegister}>Registrar rostro</button>
      <p>{status}</p>
    </div>
  );
}

export function FacialLogin({ token, onSuccess }) {
  const videoRef = useRef();
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function loadModels() {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    }
    loadModels();
  }, []);

  const handleLogin = async () => {
    setStatus('Capturando rostro...');
    const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
    if (!detection) {
      setStatus('No se detectó rostro.');
      return;
    }
    setStatus('Verificando rostro...');
    try {
      const res = await FacialService.getDescriptor(token);
      const reference = res.data.descriptor;
      const distance = faceapi.euclideanDistance(detection.descriptor, new Float32Array(reference));
      if (distance < 0.6) {
        setStatus('Acceso concedido.');
        if (onSuccess) onSuccess();
      } else {
        setStatus('Rostro no coincide.');
      }
    } catch (err) {
      setStatus('Error al verificar rostro.');
    }
  };

  return (
    <div>
      <h3>Login facial</h3>
      <video ref={videoRef} autoPlay width={320} height={240} style={{ border: '1px solid #ccc' }} />
      <button onClick={handleLogin}>Iniciar sesión por rostro</button>
      <p>{status}</p>
    </div>
  );
}
