
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
  accessToken: string | null
  refreshToken: string | null
  login: (user: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  checkAuthStatus: () => Promise<boolean>
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isChecking: false,
      accessToken: null,
      refreshToken: null,
      login: (user) => {
        set({
          user,
          isAuthenticated: true,
        })
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
        })
      },
      setTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
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
        if (isChecking) {
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
          set({
            user: null,
            isAuthenticated: false,
            isChecking: false,
          })
          return false
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)
