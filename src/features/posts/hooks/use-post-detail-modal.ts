import { useCallback } from "react"
import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { PostsAPI } from "../api/post-api"
import { Post } from "../types/post-type"

export function usePostDetailModal(post: Post, options?: { enabled?: boolean }) {
  const { user } = useAuthStore()

  // 조회수 증가 뮤테이션
  const viewMutation = useMutation({
    mutationFn: async () => {
      if (!post?.id) return
      return PostsAPI.incrementViews(post.id, user?.id)
    },
  })

  // 조회수 증가 함수 (외부에서 호출할 때만 실행)
  const incrementViews = useCallback(() => {
    if (post?.id && !viewMutation.isPending) {
      viewMutation.mutate()
    }
  }, [post?.id, viewMutation])

  return {
    incrementViews,
  }crementViews,
    comments,
    isLoadingComments,
    isSubmittingComment: createCommentMutation.isPending,
  }
}