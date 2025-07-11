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
        // 인증 실패 시 모든 인증 정보 초기화
        cookieUtils.remove('accessToken', '/')
        cookieUtils.remove('refreshToken', '/')

        set({
          user: null,
          isAuthenticated: false,
          isChecking: false,
        })

        // localStorage에서도 제거
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
        }
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
        const { isChecking, isAuthenticated, user } = get()
        
        // 이미 체크 중이거나 인증된 상태라면 중복 체크 안함
        if (isChecking) {
          return isAuthenticated
        }

        // 이미 인증되어 있고 사용자 정보가 있다면 추가 체크 안함
        if (isAuthenticated && user) {
          return true
        }

        // 쿠키에서 토큰 확인
        const token = cookieUtils.get('accessToken')
        if (!token) {
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
      // persist 복원 시 쿠키 토큰 확인
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          const token = cookieUtils.get('accessToken')
          if (!token && state.isAuthenticated) {
            // 쿠키에 토큰이 없으면 인증 상태 초기화
            state.clearAuth()
          }
        }
      },
    }
  )
)