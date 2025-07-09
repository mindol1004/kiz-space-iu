
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
  lastSeenAt: Date
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (user: User, tokens?: { accessToken: string; refreshToken: string }) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, tokens) => {
        set({
          user,
          accessToken: tokens?.accessToken || null,
          refreshToken: tokens?.refreshToken || null,
          isAuthenticated: true,
        })
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
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
      setTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
      },
    }),
    {
      name: "auth-storage",
    }
  )
)
