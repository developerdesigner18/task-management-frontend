import axios from 'axios'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

class ApiService {
  // Generic HTTP methods
  async get(url, params = {}) {
    try {
      const response = await apiClient.get(url, { params })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const response = await apiClient.post(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const response = await apiClient.put(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async patch(url, data = {}, config = {}) {
    try {
      const response = await apiClient.patch(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await apiClient.delete(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // File upload method
  async upload(url, formData, onProgress = null) {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      
      if (onProgress) {
        config.onUploadProgress = onProgress
      }
      
      const response = await apiClient.post(url, formData, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
      }
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error - please check your connection',
        status: 0
      }
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0
      }
    }
  }

}

// Create and export singleton instance
const apiService = new ApiService()
export default apiService
