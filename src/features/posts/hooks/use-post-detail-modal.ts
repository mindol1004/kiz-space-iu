import { useState, useEffect, useCallback } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { PostsAPI } from "../api/post-api"
import { useComments, useCreateComment } from "@/features/comments/hooks/use-comments"
import { Post } from "../types/post-type"

export function usePostDetailModal(post: Post) {
  const { user } = useAuthStore()
  const [comment, setComment] = useState("")
  const queryClient = useQueryClient()

  // 댓글 데이터 가져오기
  const { data: commentsData, isLoading: isLoadingComments } = useComments(post?.id || "")
  const comments = commentsData || { comments: [], total: 0 }
  const createCommentMutation = useCreateComment()

  // 조회수 증가 뮤테이션
  const viewMutation = useMutation({
    mutationFn: () => PostsAPI.incrementViews(post.id, user?.id || ""),
    onSuccess: (data) => {
      queryClient.setQueryData(["post", post.id], (oldData: Post) => ({
        ...oldData,
        viewsCount: data.viewsCount,
      }))
    },
  })

  const incrementViews = useCallback(() => {
    viewMutation.mutate()
  }, [viewMutation])

  useEffect(() => {
    console.log("Comments changed:", comments)
  }, [comments])

  return {
    comment,
    setComment,
    incrementViews,
    comments,
    isLoadingComments,
    isSubmittingComment: createCommentMutation.isPending,
  }
}