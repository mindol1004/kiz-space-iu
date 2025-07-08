import { create } from "zustand"
import type { Post } from "@/lib/schemas"

interface PostState {
  posts: Post[]
  selectedCategory: string
  selectedAgeGroup: string
  setPosts: (posts: Post[]) => void
  addPost: (post: Post) => void
  updatePost: (postId: string, updates: Partial<Post>) => void
  setSelectedCategory: (category: string) => void
  setSelectedAgeGroup: (ageGroup: string) => void
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  selectedCategory: "all",
  selectedAgeGroup: "all",
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (postId, updates) =>
    set((state) => ({
      posts: state.posts.map((post) => (post._id === postId ? { ...post, ...updates } : post)),
    })),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedAgeGroup: (selectedAgeGroup) => set({ selectedAgeGroup }),
}))
