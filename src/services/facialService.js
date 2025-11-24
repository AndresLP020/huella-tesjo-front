import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';
const FACIAL_BASE = `${API_BASE}/facial`;

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
    const response = await axios.post(`${API_BASE}/auth/login-facial`, {
      email,
      descriptor: Array.from(descriptor) // Asegurar que es un array
    });
    return response.data;
  }
};
