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

const initializeAuthFromCookies = () => {
  if (typeof window === 'undefined') return { user: null, isAuthenticated: false }

  try {
    const token = cookieUtils.get('accessToken')
    const userInfo = cookieUtils.get('userInfo')

    if (token && userInfo) {
      const user = JSON.parse(userInfo)
      return { user, isAuthenticated: true }
    }
  } catch (error) {
    console.error('Error initializing auth from cookies:', error)
  }

  return { user: null, isAuthenticated: false }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const initialState = initializeAuthFromCookies()

      return {
        user: initialState.user,
        isAuthenticated: initialState.isAuthenticated,
        isChecking: false,

        login: (user: User) => {
          // 사용자 정보를 쿠키에도 저장
          cookieUtils.set('userInfo', JSON.stringify({
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            verified: user.verified
          }), '/') // 15분

          set({ user, isAuthenticated: true })
        },

        logout: () => {
          // 쿠키 삭제
          cookieUtils.remove('accessToken', '/')
          cookieUtils.remove('refreshToken', '/')
          cookieUtils.remove('userInfo', '/')
          set({ user: null, isAuthenticated: false })
        },

        clearAuth: () => {
          cookieUtils.remove('accessToken', '/')
          cookieUtils.remove('refreshToken', '/')
          cookieUtils.remove('userInfo', '/')
          set({ user: null, isAuthenticated: false, isChecking: false })
        },

        updateUser: (userData: Partial<User>) => {
          const currentUser = get().user
          if (currentUser) {
            const updatedUser = { ...currentUser, ...userData }
            // 쿠키의 사용자 정보도 업데이트
            cookieUtils.set('userInfo', JSON.stringify({
              id: updatedUser.id,
              email: updatedUser.email,
              nickname: updatedUser.nickname,
              avatar: updatedUser.avatar,
              verified: updatedUser.verified
            }), '/')
            set({ user: updatedUser })
          }
        },

        checkAuthStatus: async () => {
          const { isAuthenticated, user } = get()

          // 이미 인증되어 있고 사용자 정보가 있다면 바로 반환
          if (isAuthenticated && user) {
            return true
          }

          set({ isChecking: true })

          try {
            // 쿠키에서 토큰 확인
            const token = cookieUtils.get('accessToken')

            if (!token) {
              set({ user: null, isAuthenticated: false, isChecking: false })
              return false
            }

            // 서버에서 인증 확인
            const { AuthAPI } = await import('@/features/auth/api/auth-api')
            const response = await AuthAPI.checkAuth()

            if (response.user) {
              // 사용자 정보를 쿠키에도 저장
              cookieUtils.set('userInfo', JSON.stringify({
                id: response.user.id,
                email: response.user.email,
                nickname: response.user.nickname,
                avatar: response.user.avatar,
                verified: response.user.verified
              }), '/')

              set({ 
                user: response.user, 
                isAuthenticated: true, 
                isChecking: false 
              })
              return true
            } else {
              set({ user: null, isAuthenticated: false, isChecking: false })
              return false
            }
          } catch (error) {
            console.error('Auth check failed:', error)
            // 인증 실패 시 쿠키 삭제
            cookieUtils.remove('accessToken', '/')
            cookieUtils.remove('refreshToken', '/')
            cookieUtils.remove('userInfo', '/')
            set({ user: null, isAuthenticated: false, isChecking: false })
            return false
          }
        },

        updateTokens: (tokens: { accessToken: string; refreshToken: string }) => {
          // 토큰은 httpOnly 쿠키로 관리되므로 여기서는 별도 처리 불필요
          // 필요시 추가 로직 구현
        }
      }
    },
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