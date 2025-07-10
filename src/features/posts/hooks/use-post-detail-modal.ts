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
  const { data: commentsData, isLoading: isLoadingComments } = useComments(post?.id || "", true)
  const comments = commentsData || { comments: [], total: 0 }
  const createCommentMutation = useCreateComment()

  // 댓글 제출 함수
  const handleCommentSubmit = async () => {
    if (!comment.trim() || !user?.id) return

    try {
      await createCommentMutation.mutateAsync({
        postId: post.id,
        content: comment.trim(),
      })
      setComment("")
    } catch (error) {
      console.error("댓글 작성 실패:", error)
    }
  }

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

  useEffect(() => {
    console.log("Comments changed:", comments)
  }, [comments])

  return {
    comment,
    setComment,
    handleCommentSubmit,
    incrementViews,
    comments,
    isLoadingComments,
    isSubmittingComment: createCommentMutation.isPending,
  }
}