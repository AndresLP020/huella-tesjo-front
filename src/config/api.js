// Configuración de API para desarrollo y producción
const API_CONFIG = {
  // URL base de la API
  baseURL: 'http://localhost:3001/api', // Siempre usar backend local en desarrollo
  
  // Timeout para requests
  timeout: 30000,
  
  // Headers por defecto
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Configuración para cookies/credenciales
  withCredentials: true
};

// Endpoints específicos
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Biometría / WebAuthn
  BIOMETRIC_STATUS: '/auth/biometric/status',
  BIOMETRIC_REGISTER_OPTIONS: '/auth/biometric/registration-options',
  BIOMETRIC_REGISTER_VERIFY: '/auth/biometric/registration-verify',
  BIOMETRIC_LOGIN_OPTIONS: '/auth/biometric/authentication-options',
  BIOMETRIC_LOGIN_VERIFY: '/auth/biometric/authentication-verify',
  BIOMETRIC_TOGGLE: '/auth/biometric/toggle',
  BIOMETRIC_DELETE: '/auth/biometric/delete',
  BIOMETRIC_DIAGNOSTIC: '/auth/biometric/diagnostic',
  
  // Usuarios
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  
  // Asignaciones
  ASSIGNMENTS: '/assignments',
  
  // Carreras y Semestres
  CARRERAS: '/carreras',
  SEMESTRES: '/semestres',
  
  // Estadísticas
  STATS: '/stats',
  
  // Registros diarios
  DAILY_RECORDS: '/daily-records',
  
  // Operaciones en lote
  BULK_OPERATIONS: '/bulk'
};

export default API_CONFIG;