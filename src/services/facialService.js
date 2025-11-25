import axios from 'axios';
import API_CONFIG from '../config/api';

const FACIAL_BASE = `${API_CONFIG.baseURL}/facial`;
const AUTH_BASE = `${API_CONFIG.baseURL}/auth`;

export const FacialService = {
  async registerDescriptor(descriptor, token) {
    return axios.post(`${FACIAL_BASE}/register`, { descriptor }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  async getDescriptor(token) {
    return axios.get(`${FACIAL_BASE}/descriptor`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  // Login facial sin necesidad de token previo
  async loginWithFace(email, descriptor) {
    const response = await axios.post(`${AUTH_BASE}/login-facial`, {
      email,
      descriptor: Array.from(descriptor) // Asegurar que es un array
    });
    return response.data;
  }
};
