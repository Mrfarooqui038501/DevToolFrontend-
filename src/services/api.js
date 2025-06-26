import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://devtoolbackend-kadi.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add loading state or auth token here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { data, status } = error.response
      return Promise.reject({
        message: data.message || 'An error occurred',
        status,
        details: data.error || data
      })
    } else if (error.request) {
      // Network error
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0
      })
    } else {
      // Other error
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        status: 0
      })
    }
  }
)

// JSON Formatter API
export const jsonAPI = {
  format: (json) => api.post('/format-json', { json }),
  validate: (json) => api.post('/validate-json', { json })
}

// Base64 API
export const base64API = {
  encode: (text) => api.post('/encode', { text }),
  decode: (encoded) => api.post('/decode', { encoded })
}

// History API
export const historyAPI = {
  getAll: (params = {}) => api.get('/history', { params }),
  getStats: () => api.get('/history/stats'),
  getById: (id) => api.get(`/history/${id}`),
  cleanup: () => api.delete('/history/cleanup')
}

// Health check
export const healthAPI = {
  check: () => axios.get('http://localhost:5000/health')
}

export default api 