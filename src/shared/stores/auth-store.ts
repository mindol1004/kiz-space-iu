import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  nickname: string
  avatar?: string
  region?: string
  location?: string
  interests: string[]
  children?: any[]
  verified?: boolean
  bio?: string
  postsCount?: number
  followersCount?: number
  followingCount?: number
  createdAt: Date
  updatedAt: Date
  lastSeenAt?: Date
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isChecking: boolean
  login: (user: User) => void
  logout: () => void
  clearAuth: () => void // 새로 추가
  updateUser: (userData: Partial<User>) => void
  checkAuthStatus: () => Promise<boolean>
  updateTokens: (tokens: { accessToken: string; refreshToken: string }) => void
}

// 쿠키 유틸리티 함수
const cookieUtils = {
  get: (name: string): string | null => {
    if (typeof window === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  },

  remove: (name: string, path: string = '/', domain?: string) => {
    if (typeof window === 'undefined') return
    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`
    if (domain) cookieString += `; domain=${domain}`
    document.cookie = cookieString
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isChecking: false,

      login: (user) => {
        set({
          user,
          isAuthenticated: true,
        })
      },

      logout: () => {
        // 쿠키에서 토큰 제거
        cookieUtils.remove('accessToken', '/')
        cookieUtils.remove('refreshToken', '/')

        // 상태 초기화
        set({
          user: null,
          isAuthenticated: false,
        })

        // localStorage에서도 제거 (persist 데이터)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
        }
      },

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          isChecking: false,
        })
      },

      updateTokens: (tokens: { accessToken: string; refreshToken: string }) => {
        // 토큰은 httpOnly 쿠키로 관리되므로 여기서는 별도 처리 불필요
        // 필요시 추가 로직 구현
      },

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          })
        }
      },

      checkAuthStatus: async () => {
        const { isChecking } = get()

        // 이미 체크 중이라면 대기
        if (isChecking) {
          return new Promise<boolean>((resolve) => {
            const checkInterval = setInterval(() => {
              const currentState = get()
              if (!currentState.isChecking) {
                clearInterval(checkInterval)
                resolve(currentState.isAuthenticated)
              }
            }, 100)
          })
        }

        // 쿠키에서 토큰 확인
        const token = cookieUtils.get('accessToken')
        if (!token) {
          console.log('No token found in checkAuthStatus')
          get().clearAuth()
          return false
        }

        // 토큰 만료 체크
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const currentTime = Math.floor(Date.now() / 1000)
          if (payload.exp && payload.exp < currentTime) {
            console.log('Token expired in checkAuthStatus')
            get().clearAuth()
            return false
          }
        } catch (error) {
          console.log('Invalid token format in checkAuthStatus')
          get().clearAuth()
          return false
        }

        set({ isChecking: true })

        try {
          const { AuthAPI } = await import('@/features/auth/api/auth-api')
          const response = await AuthAPI.checkAuth()

          set({
            user: response.user,
            isAuthenticated: true,
            isChecking: false,
          })

          return true
        } catch (error) {
          console.error('Auth check failed:', error)
          set({ isChecking: false })
          get().clearAuth()
          return false
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // persist 복원 시 토큰 확인
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          // 즉시 토큰 확인
          const token = cookieUtils.get('accessToken')
          if (!token && state.isAuthenticated) {
            console.log('No token found, clearing auth state')
            state.clearAuth()
          } else if (token && state.isAuthenticated) {
            console.log('Token found, maintaining auth state')
          }
        }
      },
    }
  )
)