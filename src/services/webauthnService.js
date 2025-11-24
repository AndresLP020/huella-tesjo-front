import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.js';

const API_BASE_URL = 'http://localhost:3001/api';

// Helper para obtener el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper para obtener headers con autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

const WebAuthnService = {
  /**
   * Verifica si el navegador soporta WebAuthn
   */
  isSupported() {
    return !!(window.PublicKeyCredential && navigator.credentials);
  },

  /**
   * Verifica si hay un autenticador disponible
   */
  async hasAvailableAuthenticator() {
    if (!this.isSupported()) {
      return false;
    }

    try {
      // Verificar si hay autenticadores disponibles
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch (error) {
      console.error('Error verificando autenticador:', error);
      return false;
    }
  },

  /**
   * Registra un nuevo dispositivo biométrico
   */
  async registerDevice() {
    try {
      if (!this.isSupported()) {
        throw new Error('WebAuthn no está soportado en este navegador');
      }

      // 1. Obtener opciones de registro del servidor
      const optionsResponse = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.BIOMETRIC_REGISTER_OPTIONS}`,
        {},
        { headers: getAuthHeaders() }
      );

      const options = optionsResponse.data;

      // 2. Convertir challenge de base64 a ArrayBuffer
      const publicKey = {
        ...options.publicKey,
        challenge: Uint8Array.from(atob(options.publicKey.challenge), c => c.charCodeAt(0)),
        user: {
          ...options.publicKey.user,
          id: Uint8Array.from(atob(options.publicKey.user.id), c => c.charCodeAt(0))
        }
      };

      // 3. Crear la credencial
      const credential = await navigator.credentials.create({
        publicKey: publicKey
      });

      // 4. Convertir la respuesta a base64 para enviarla al servidor
      const response = {
        id: credential.id,
        rawId: Array.from(new Uint8Array(credential.rawId))
          .map(b => String.fromCharCode(b))
          .join(''),
        response: {
          clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON))
            .map(b => String.fromCharCode(b))
            .join(''),
          attestationObject: Array.from(new Uint8Array(credential.response.attestationObject))
            .map(b => String.fromCharCode(b))
            .join('')
        },
        type: credential.type
      };

      // 5. Enviar la credencial al servidor para verificación
      const verifyResponse = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.BIOMETRIC_REGISTER_VERIFY}`,
        {
          credential: {
            id: btoa(response.id),
            rawId: btoa(response.rawId),
            response: {
              clientDataJSON: btoa(response.response.clientDataJSON),
              attestationObject: btoa(response.response.attestationObject)
            },
            type: response.type
          }
        },
        { headers: getAuthHeaders() }
      );

      return verifyResponse.data;
    } catch (error) {
      console.error('Error registrando dispositivo:', error);
      throw new Error(error.response?.data?.message || 'Error al registrar dispositivo biométrico');
    }
  },

  /**
   * Autentica usando biométrico
   */
  async authenticateWithBiometric() {
    try {
      if (!this.isSupported()) {
        throw new Error('WebAuthn no está soportado en este navegador');
      }

      // 1. Obtener opciones de autenticación del servidor
      const optionsResponse = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.BIOMETRIC_LOGIN_OPTIONS}`,
        {},
        { headers: getAuthHeaders() }
      );

      const options = optionsResponse.data;

      // 2. Convertir challenge de base64 a ArrayBuffer
      const publicKey = {
        ...options.publicKey,
        challenge: Uint8Array.from(atob(options.publicKey.challenge), c => c.charCodeAt(0)),
        allowCredentials: options.publicKey.allowCredentials?.map(cred => ({
          ...cred,
          id: Uint8Array.from(atob(cred.id), c => c.charCodeAt(0))
        }))
      };

      // 3. Obtener la credencial del usuario
      const assertion = await navigator.credentials.get({
        publicKey: publicKey
      });

      // 4. Convertir la respuesta a base64 para enviarla al servidor
      const response = {
        id: assertion.id,
        rawId: Array.from(new Uint8Array(assertion.rawId))
          .map(b => String.fromCharCode(b))
          .join(''),
        response: {
          clientDataJSON: Array.from(new Uint8Array(assertion.response.clientDataJSON))
            .map(b => String.fromCharCode(b))
            .join(''),
          authenticatorData: Array.from(new Uint8Array(assertion.response.authenticatorData))
            .map(b => String.fromCharCode(b))
            .join(''),
          signature: Array.from(new Uint8Array(assertion.response.signature))
            .map(b => String.fromCharCode(b))
            .join(''),
          userHandle: assertion.response.userHandle 
            ? Array.from(new Uint8Array(assertion.response.userHandle))
                .map(b => String.fromCharCode(b))
                .join('')
            : null
        },
        type: assertion.type
      };

      // 5. Verificar la autenticación con el servidor
      const verifyResponse = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.BIOMETRIC_LOGIN_VERIFY}`,
        {
          assertion: {
            id: btoa(response.id),
            rawId: btoa(response.rawId),
            response: {
              clientDataJSON: btoa(response.response.clientDataJSON),
              authenticatorData: btoa(response.response.authenticatorData),
              signature: btoa(response.response.signature),
              userHandle: response.response.userHandle ? btoa(response.response.userHandle) : null
            },
            type: response.type
          }
        },
        { headers: getAuthHeaders() }
      );

      const result = verifyResponse.data;
      
      // Guardar token y usuario si la autenticación fue exitosa
      if (result.success && result.token) {
        localStorage.setItem('token', result.token);
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
      }

      return result;
    } catch (error) {
      console.error('Error en autenticación biométrica:', error);
      throw new Error(error.response?.data?.message || 'Error en la autenticación biométrica');
    }
  },

  /**
   * Obtiene los dispositivos biométricos registrados
   */
  async getRegisteredDevices() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.BIOMETRIC_STATUS}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error obteniendo dispositivos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener dispositivos registrados');
    }
  },

  /**
   * Obtiene el estado biométrico del usuario
   */
  async getBiometricStatus() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.BIOMETRIC_STATUS}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estado biométrico:', error);
      // Si el endpoint no existe (404), retornar estado por defecto
      if (error.response?.status === 404) {
        return { enabled: false, registeredAt: null, hasDevices: false };
      }
      // Si no hay estado, retornar estado por defecto
      return { enabled: false, registeredAt: null, hasDevices: false };
    }
  },

  /**
   * Elimina un dispositivo biométrico
   */
  async removeDevice() {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.BIOMETRIC_DELETE}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error eliminando dispositivo:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar dispositivo');
    }
  },

  /**
   * Elimina la configuración biométrica
   */
  async deleteBiometric() {
    return this.removeDevice();
  },

  /**
   * Activa o desactiva la autenticación biométrica
   */
  async toggleBiometric(enable) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.BIOMETRIC_TOGGLE}`,
        { enabled: enable },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error cambiando estado biométrico:', error);
      throw new Error(error.response?.data?.message || 'Error al cambiar estado biométrico');
    }
  },

  /**
   * Verifica si un usuario tiene dispositivos biométricos registrados
   */
  async userHasBiometricDevices(email) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/biometric/check-user-devices`,
        { email },
        { headers: getAuthHeaders() }
      );
      return response.data.hasDevices || false;
    } catch (error) {
      console.error('Error verificando dispositivos del usuario:', error);
      return false;
    }
  }
};

export default WebAuthnService;
