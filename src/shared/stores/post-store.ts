
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PostStore {
  selectedCategory: string
  selectedAgeGroup: string
  sortBy: "createdAt" | "likesCount" | "commentsCount"
  sortOrder: "desc" | "asc"
  
  setSelectedCategory: (category: string) => void
  setSelectedAgeGroup: (ageGroup: string) => void
  setSortBy: (sortBy: "createdAt" | "likesCount" | "commentsCount") => void
  setSortOrder: (sortOrder: "desc" | "asc") => void
  resetFilters: () => void
}

const initialState = {
  selectedCategory: "all",
  selectedAgeGroup: "all",
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
}

export const usePostStore = create<PostStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedAgeGroup: (ageGroup) => set({ selectedAgeGroup: ageGroup }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
      resetFilters: () => set(initialState),
    }),
    {
      name: "post-store",
      partialize: (state) => ({
        selectedCategory: state.selectedCategory,
        selectedAgeGroup: state.selectedAgeGroup,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
      }),
    }
  )
)
