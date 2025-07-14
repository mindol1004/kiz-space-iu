
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { cookieUtils } from "@/lib/cookie"

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
  clearAuth: () => void
  updateUser: (userData: Partial<User>) => void
  checkAuthStatus: () => Promise<boolean>
  updateTokens: (tokens: { accessToken: string; refreshToken: string }) => void
}

const initializeAuthFromCookies = () => {
  if (typeof window === 'undefined') return { user: null, isAuthenticated: false }

  try {
    const token = cookieUtils.get('accessToken')
    const userInfo = cookieUtils.get('userInfo')

    console.log('Initializing auth from cookies:', { hasToken: !!token, hasUserInfo: !!userInfo })

    if (token && userInfo) {
      // 토큰 만료 체크
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Math.floor(Date.now() / 1000)
        const isExpired = payload.exp && payload.exp < currentTime

        if (isExpired) {
          console.log('Token expired during initialization')
          // 만료된 쿠키 삭제
          cookieUtils.remove('accessToken', '/')
          cookieUtils.remove('refreshToken', '/')
          cookieUtils.remove('userInfo', '/')
          return { user: null, isAuthenticated: false }
        }

        const user = JSON.parse(userInfo)
        console.log('Successfully initialized auth from cookies')
        return { user, isAuthenticated: true }
      } catch (error) {
        console.error('Error parsing token during initialization:', error)
        return { user: null, isAuthenticated: false }
      }
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
          console.log('Auth store: Login called with user:', user.email)
          
          // 사용자 정보를 쿠키에 저장
          const userInfo = {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            avatar: user.avatar,
            verified: user.verified
          }

          cookieUtils.set('userInfo', JSON.stringify(userInfo), {
            path: '/',
            expires: 15 / (24 * 60) // 15분을 일 단위로 변환
          })

          set({ user, isAuthenticated: true })
          console.log('Auth store: Login completed')
        },

        logout: () => {
          console.log('Auth store: Logout called')
          // 쿠키 삭제
          cookieUtils.remove('accessToken', '/')
          cookieUtils.remove('refreshToken', '/')
          cookieUtils.remove('userInfo', '/')
          set({ user: null, isAuthenticated: false })
          console.log('Auth store: Logout completed')
        },

        clearAuth: () => {
          console.log('Auth store: Clear auth called')
          cookieUtils.remove('accessToken', '/')
          cookieUtils.remove('refreshToken', '/')
          cookieUtils.remove('userInfo', '/')
          set({ user: null, isAuthenticated: false, isChecking: false })
          console.log('Auth store: Clear auth completed')
        },

        updateUser: (userData: Partial<User>) => {
          const currentUser = get().user
          if (currentUser) {
            const updatedUser = { ...currentUser, ...userData }
            
            // 쿠키의 사용자 정보도 업데이트
            const userInfo = {
              id: updatedUser.id,
              email: updatedUser.email,
              nickname: updatedUser.nickname,
              avatar: updatedUser.avatar,
              verified: updatedUser.verified
            }

            cookieUtils.set('userInfo', JSON.stringify(userInfo), {
              path: '/',
              expires: 15 / (24 * 60)
            })
            
            set({ user: updatedUser })
          }
        },

        checkAuthStatus: async () => {
          const { isAuthenticated, user } = get()

          // 이미 인증되어 있고 사용자 정보가 있다면 바로 반환
          if (isAuthenticated && user) {
            console.log('Auth store: Already authenticated')
            return true
          }

          console.log('Auth store: Checking auth status with server')
          set({ isChecking: true })

          try {
            // 쿠키에서 토큰 확인
            const token = cookieUtils.get('accessToken')

            if (!token) {
              console.log('Auth store: No access token found')
              set({ user: null, isAuthenticated: false, isChecking: false })
              return false
            }

            // 서버에서 인증 확인
            const { AuthAPI } = await import('@/features/auth/api/auth-api')
            const response = await AuthAPI.checkAuth()

            if (response.user) {
              console.log('Auth store: Server auth check successful')
              
              // 사용자 정보를 쿠키에도 저장
              const userInfo = {
                id: response.user.id,
                email: response.user.email,
                nickname: response.user.nickname,
                avatar: response.user.avatar,
                verified: response.user.verified
              }

              cookieUtils.set('userInfo', JSON.stringify(userInfo), {
                path: '/',
                expires: 15 / (24 * 60)
              })

              set({ 
                user: response.user, 
                isAuthenticated: true, 
                isChecking: false 
              })
              return true
            } else {
              console.log('Auth store: Server auth check failed - no user')
              set({ user: null, isAuthenticated: false, isChecking: false })
              return false
            }
          } catch (error) {
            console.error('Auth store: Auth check failed:', error)
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
          console.log('Auth store: Tokens updated')
        }
      }
    },
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          console.log('Auth store: Rehydrating from storage')
          // 즉시 토큰 확인
          const token = cookieUtils.get('accessToken')
          if (!token && state.isAuthenticated) {
            console.log('Auth store: No token found during rehydration, clearing auth state')
            state.clearAuth()
          } else if (token && state.isAuthenticated) {
            console.log('Auth store: Token found during rehydration, maintaining auth state')
          }
        }
      },
    }
  )
)
