import axios from 'axios'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

class BaseService {
  constructor() {
    this.axiosInstance = null
    this.initializeAxios()
  }

  initializeAxios() {
    const appStore = useAppStore()
    this.axiosInstance = axios.create({
      baseURL: appStore.apiUrl,
      headers: {
        'content-type': 'application/json',
        accept: '*/*',
      },
      responseType: 'json',
      responseEncoding: 'utf8',
    })

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const appStore = useAppStore()
        const authStore = useAuthStore()
        appStore.setLoading(true)

        // Add auth token if available
        const token = authStore.authToken || localStorage.getItem('admin_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add current user id if available
        const userId = authStore.userId
        if (userId) {
          config.headers['current-userid'] = userId
        }

        return config
      },
      (error) => {
        const appStore = useAppStore()
        appStore.setLoading(false)
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        const appStore = useAppStore()
        appStore.setLoading(false)

        // Handle custom status codes from your API
        if (response.data?.status) {
          switch (response.data.status) {
            case 407:
              router.push({ path: '/auth/login' })
              return Promise.reject(new Error('Authentication required'))
            case 401:
              this.handleUnauthorized()
              return Promise.reject(new Error('Unauthorized'))
            case 200:
              return response
            default:
              return Promise.reject(response)
          }
        }
        return response
      },
      (error) => {
        const appStore = useAppStore()
        appStore.setLoading(false)

        // Handle network errors
        if (error.code === 'ERR_NETWORK') {
          console.error('Network error:', error)
          router.replace({ path: '/auth/login' })
          return Promise.reject(error)
        }

        // Handle HTTP status codes
        if (error.response) {
          switch (error.response.status) {
            case 401:
              this.handleUnauthorized()
              break
            case 403:
              console.error('Forbidden access')
              break
            case 404:
              console.error('Resource not found')
              break
            case 500:
              console.error('Server error')
              break
          }
        }
        return Promise.reject(error)
      },
    )
  }

  handleUnauthorized() {
    const authStore = useAuthStore()
    authStore.clearAuth && authStore.clearAuth()
    router.replace({ path: '/auth/login' })
  }

  getAxios(headerOptions = {}) {
    if (Object.keys(headerOptions).length > 0) {
      const customInstance = axios.create({
        ...this.axiosInstance.defaults,
        headers: {
          ...this.axiosInstance.defaults.headers,
          ...headerOptions,
        },
      })
      customInstance.interceptors.request = this.axiosInstance.interceptors.request
      customInstance.interceptors.response = this.axiosInstance.interceptors.response
      return customInstance
    }
    return this.axiosInstance
  }

  getBaseUrl() {
    const appStore = useAppStore()
    return appStore.apiUrl
  }

  // HTTP Methods
  async get(url, config = {}) {
    try {
      const response = await this.axiosInstance.get(url, config)
      return response
    } catch (error) {
      console.error(`GET ${url} failed:`, error)
      throw error
    }
  }

  async post(url, data, config = {}) {
    try {
      const response = await this.axiosInstance.post(url, data, config)
      return response
    } catch (error) {
      console.error(`POST ${url} failed:`, error)
      throw error
    }
  }

  async put(url, data, config = {}) {
    try {
      const response = await this.axiosInstance.put(url, data, config)
      return response
    } catch (error) {
      console.error(`PUT ${url} failed:`, error)
      throw error
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.axiosInstance.delete(url, config)
      return response
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error)
      throw error
    }
  }

  // File upload
  async postFile(url, data) {
    let formData = new FormData()
    if (data instanceof FormData) {
      formData = data
    } else if (data instanceof File) {
      formData.append('file', data)
    } else if (typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        if (data[key] instanceof File) {
          formData.append(key, data[key])
        } else {
          formData.append(key, JSON.stringify(data[key]))
        }
      })
    }
    return this.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  // Utility methods
  getQueryStringOfObject(params) {
    if (!params || typeof params !== 'object') return ''
    const queryString = Object.entries(params)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    return queryString || '1=1'
  }

  buildUrl(path, params) {
    const queryString = this.getQueryStringOfObject(params)
    return queryString ? `${path}?${queryString}` : path
  }

  getUnAuthorizedUrl(url) {
    const appStore = useAppStore()
    return appStore.apiUrl + url
  }

  // Update auth token (call this after successful login)
  updateAuthToken(token) {
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization']
    }
  }
}

export default new BaseService()
