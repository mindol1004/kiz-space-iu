import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  _id?: string // Added _id as optional string
  id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  location?: string
  interests: string[]
  children: Array<{
    id: string
    name: string
    birthDate: string
    gender: string
  }>
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing?: boolean
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "auth-storage",
    },
  ),
)
