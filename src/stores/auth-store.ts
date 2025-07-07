// Mock 사용자로 초기화
import { create } from "zustand"
import type { User } from "@/lib/schemas"
import { mockUsers } from "@/lib/mock-data"

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUsers[0], // 기본적으로 첫 번째 사용자로 로그인된 상태
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}))
