import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/shared/stores/auth-store'
import { cookieUtils } from '@/lib/cookie'

// API 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    // NOTE: If accessToken is httpOnly, we should NOT try to get it from cookies
    // and manually set the Authorization header. The browser will automatically
    // send httpOnly cookies with the request. The server should handle authentication
    // by reading the httpOnly cookies directly.
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response 인터셉터 - 토큰 만료 처리 및 에러 처리
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // 토큰 만료로 인한 401 에러인 경우 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include', // 쿠키 포함
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (refreshResponse.ok) {
          // IMPORTANT: If accessToken is httpOnly and server sets it via Set-Cookie header,
          // we should NOT try to get it from refreshResponse.json() and manually set Authorization.
          // The browser will automatically include the new httpOnly cookie with the retried request.
          // The following lines are removed because they are likely problematic for httpOnly tokens.
          // const data = await refreshResponse.json()
          // const { accessToken: newAccessToken } = data.tokens
          // if (originalRequest.headers) {
          //   originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          // }

          // We just need to re-dispatch the original request.
          // The browser will automatically include the fresh httpOnly cookie.
          return api(originalRequest)
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃
        useAuthStore.getState().logout()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    // 네트워크 에러 처리
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.error('Network error:', error)
      return Promise.reject(new Error('네트워크 연결을 확인해주세요.'))
    }

    // 서버 에러 처리
    if (error.response?.status >= 500) {
      console.error('Server error:', error)
      return Promise.reject(new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'))
    }

    // 클라이언트 에러 처리
    if (error.response?.status >= 400 && error.response?.status < 500) {
      const errorMessage = error.response.data?.error || error.response.data?.message || '요청을 처리할 수 없습니다.'
      return Promise.reject(new Error(errorMessage))
    }

    return Promise.reject(error)
  }
)

// API 호출 헬퍼 함수들
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.put<T>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    api.patch<T>(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    api.delete<T>(url, config),
}

export { axiosInstance }
export default api