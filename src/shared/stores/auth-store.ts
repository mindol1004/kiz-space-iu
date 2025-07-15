
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

        login: (user: User) => {
          set({ user, isAuthenticated: true })
        },

        logout: () => {          
          set({ user: null, isAuthenticated: false })
        },

        clearAuth: () => {
          set({ user: null, isAuthenticated: false, isChecking: false })
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

          if ((isAuthenticated && user) && !isChecking) {
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
                isChecking: false 
              })
              return true
            } else {
              set({ user: null, isAuthenticated: false, isChecking: false })
              return false
            }
          } catch (error) {
            console.error('Auth store: Auth check failed:', error)
            set({ user: null, isAuthenticated: false, isChecking: false })
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
      }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          if (state.user && !state.isAuthenticated) {
          } else if (!state.user && state.isAuthenticated) {
             state.clearAuth();
          }
        }
      },
    }
  )
)
