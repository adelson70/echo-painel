import axios from "axios"
import { useAuthStore } from "@/app/stores/auth.store"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: import.meta.env.VITE_API_TIMEOUT
    ? Number(import.meta.env.VITE_API_TIMEOUT)
    : 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

let isRefreshing = false
let failedQueue: {
  resolve: (token: string) => void
  reject: (error: any) => void
}[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

const AUTH_ROUTES = ['/auth/login', '/auth/logout', '/auth/refresh']

// =========================
// REQUEST → injeta token
// =========================
api.interceptors.request.use(config => {
  const auth = useAuthStore()

  if (auth.accessToken) {
    delete config.headers?.['Authorization']
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }

  return config
})

// =========================
// RESPONSE → trata 401
// =========================
api.interceptors.response.use(
  response => response,
  async error => {
    const auth = useAuthStore()
    const originalRequest = error.config

    const requestUrl = originalRequest.url || ''
    const isAuthRoute = AUTH_ROUTES.some(route => requestUrl.includes(route))

    // 👉 se for rota de auth, NÃO tenta refresh
    if (isAuthRoute) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await api.post("/auth/refresh-token")
        const newToken = data.accessToken

        auth.setAccessToken(newToken)

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)

        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        auth.logout()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
