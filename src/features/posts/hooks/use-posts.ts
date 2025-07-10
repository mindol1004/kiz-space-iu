import { useQuery } from "@tanstack/react-query"
import { PostsAPI } from "../api/post-api"

export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => PostsAPI.getPost(id),
    enabled: !!id,
  })
}

// Re-export hooks from other files for backward compatibility
export { usePostsList as usePosts } from "./use-posts-list"
export { useCreatePostDialog as useCreatePost } from "./use-create-post-dialog"
