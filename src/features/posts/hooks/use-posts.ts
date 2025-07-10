"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch post")
      }
      return response.json()
    },
  })
}

// Re-export hooks from other files for backward compatibility
export { usePostsList as usePosts } from "./use-posts-list"
export { useCreatePostDialog as useCreatePost } from "./use-create-post-dialog"