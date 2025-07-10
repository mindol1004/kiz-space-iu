
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  nickname: string
  avatar?: string
  location?: string
  interests: string[]
  verified: boolean
  bio?: string
  postsCount: number
  followersCount: number
  followingCount: number
  createdAt: Date
  updatedAt: Date
  lastSeenAt: Date
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  checkAuthStatus: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
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
        try {
          const response = await fetch('/api/auth/check', {
            credentials: 'include'
          })
          if (response.ok) {
            const userData = await response.json()
            set({
              user: userData.user,
              isAuthenticated: true,
            })
            return true
          } else {
            set({
              user: null,
              isAuthenticated: false,
            })
            return false
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          set({
            user: null,
            isAuthenticated: false,
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
      }),
    }
  )
)
