
import { useCallback, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { PostsAPI } from "../api/post-api"
import { CommentsAPI } from "@/features/comments/api/comment-api"
import { Post } from "../types/post-type"

export function usePostDetailModal(post: Post, options?: { enabled?: boolean }) {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState("")

  // 조회수 증가 뮤테이션
  const viewMutation = useMutation({
    mutationFn: async () => {
      if (!post?.id) return
      return PostsAPI.incrementViews(post.id, user?.id)
    },
  })

  // 댓글 목록 조회
  const {
    data: comments,
    isLoading: isLoadingComments,
  } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => CommentsAPI.getComments(post.id),
    enabled: options?.enabled && !!post.id,
  })

  // 댓글 작성 뮤테이션
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !post.id) throw new Error("로그인이 필요합니다")
      return CommentsAPI.createComment({
        postId: post.id,
        content
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post.id] })
      setComment("")
    },
  })

  // 조회수 증가 함수 (외부에서 호출할 때만 실행)
  const incrementViews = useCallback(() => {
    if (post?.id && !viewMutation.isPending) {
      viewMutation.mutate()
    }
  }, [post?.id, viewMutation])

  // 댓글 작성 함수
  const handleCommentSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    createCommentMutation.mutate(comment.trim())
  }, [comment, createCommentMutation])

  return {
    incrementViews,
    comment,
    setComment,
    handleCommentSubmit,
    comments,
    isLoadingComments,
    isSubmittingComment: createCommentMutation.isPending,
  }
}
