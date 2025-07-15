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
  hasCheckedInitialAuth: boolean
  login: (user: User) => void
  logout: () => void
  clearAuth: () => void
  updateUser: (userData: Partial<User>) => void
  checkAuthStatus: () => Promise<boolean>
  updateTokens: (tokens: { accessToken: string; refreshToken: string }) => void
}

const initializeAuthFromCookies = () => {
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
        hasCheckedInitialAuth: false,

        login: (user: User) => {
          set({ 
            user, 
            isAuthenticated: true, 
            hasCheckedInitialAuth: true 
          })
        },

        logout: () => {
          set({ 
            user: null, 
            isAuthenticated: false, 
            hasCheckedInitialAuth: true // 로그아웃도 체크 완료 상태
          })
        },

        clearAuth: () => {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isChecking: false,
            hasCheckedInitialAuth: true // 인증 초기화도 체크 완료 상태
          })
        },

        updateUser: (userData: Partial<User>) => {
          const currentUser = get().user
          if (currentUser) {
            const updatedUser = { ...currentUser, ...userData }
            set({ user: updatedUser })
          }
        },

        checkAuthStatus: async () => {
          const { isAuthenticated, user, isChecking } = get()

          // 이미 인증된 상태이고 체크 중이 아니면 바로 반환
          if ((isAuthenticated && user) && !isChecking) {
            set({ hasCheckedInitialAuth: true })
            return true
          }

          set({ isChecking: true })

          try {
            const { AuthAPI } = await import('@/features/auth/api/auth-api')
            const response = await AuthAPI.checkAuth()

            if (response.user) {
              set({
                user: response.user,
                isAuthenticated: true,
                isChecking: false,
                hasCheckedInitialAuth: true // 서버 체크 완료
              })
              return true
            } else {
              set({ 
                user: null, 
                isAuthenticated: false, 
                isChecking: false,
                hasCheckedInitialAuth: true // 서버 체크 완료 (인증 실패)
              })
              return false
            }
          } catch (error) {
            console.error('Auth store: Auth check failed:', error)
            set({ 
              user: null, 
              isAuthenticated: false, 
              isChecking: false,
              hasCheckedInitialAuth: true // 에러 발생도 체크 완료 상태
            })
            return false
          }
        },

        updateTokens: (tokens: { accessToken: string; refreshToken: string }) => {
          console.log('Auth store: Tokens updated (handled by server Set-Cookie)')
        }
      }
    },
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasCheckedInitialAuth: state.hasCheckedInitialAuth, // persist에 추가
      }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          // 불일치 상태 정리
          if (state.user && !state.isAuthenticated) {
            state.clearAuth?.()
          } else if (!state.user && state.isAuthenticated) {
            state.clearAuth?.()
          }
          
          // 페이지 새로고침 시 초기 체크 상태 리셋 (서버 재확인 필요)
          if (state.hasCheckedInitialAuth && state.isAuthenticated) {
            state.hasCheckedInitialAuth = false
          }
        }
      },
    }
  )
)