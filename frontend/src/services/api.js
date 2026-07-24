import axios from 'axios';

// Base API configuration
// During development Vite proxy redirects /analyze to http://127.0.0.1:8000
// In production VITE_API_BASE_URL can override backend endpoint if hosted separately
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 second client timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Audit Website API Service
 * @param {string} targetUrl The web URL to audit
 * @returns {Promise<Object>} Analyzed audit report JSON payload
 */
export const auditWebsite = async (targetUrl) => {
  try {
    const response = await apiClient.post('/analyze', { url: targetUrl });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Backend returned HTTP 4xx or 5xx status code
      const data = error.response.data;
      const customDetail = data?.detail || data?.message;
      
      const parsedError = new Error(customDetail || `HTTP ${error.response.status} Error`);
      parsedError.statusCode = error.response.status;
      parsedError.raw = data;
      throw parsedError;
    } else if (error.request) {
      // Request was sent but no response received (Timeout / CORS / Host Unreachable)
      const isTimeout = error.code === 'ECONNABORTED';
      const networkError = new Error(
        isTimeout
          ? 'Client request timed out while attempting to reach Page Pulse backend. Please check network connection.'
          : 'Unable to reach backend service. Please verify that the backend API is running.'
      );
      networkError.statusCode = isTimeout ? 504 : 503;
      throw networkError;
    } else {
      // Error setting up the request
      throw new Error(error.message || 'An unexpected client-side error occurred.');
    }
  }
};

export default apiClient;
