
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/shared/stores/auth-store"
import { CommentsAPI, CreateCommentData, Comment } from "../api/comment-api"

export function useComments(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => CommentsAPI.getComments(postId),
    enabled: !!postId,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (data: Omit<CreateCommentData, 'authorId'>) => {
      if (!user) {
        throw new Error("로그인이 필요합니다")
      }
      
      return CommentsAPI.createComment({
        ...data,
        authorId: user.id
      } as CreateCommentData)
    },
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", comment.postId] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "댓글 작성 완료",
        description: "댓글이 성공적으로 작성되었습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "댓글 작성 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (commentId: string) => CommentsAPI.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "댓글 삭제 완료",
        description: "댓글이 삭제되었습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "댓글 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useLikeComment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (commentId: string) => CommentsAPI.likeComment(commentId),
    onSuccess: (data, commentId) => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
      // 옵티미스틱 업데이트도 가능
    },
    onError: (error: Error) => {
      toast({
        title: "좋아요 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useCreateReply() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async ({ parentId, content, postId }: { parentId: string; content: string; postId: string }) => {
      if (!user) {
        throw new Error("로그인이 필요합니다")
      }
      
      return CommentsAPI.createReply(parentId, { content, postId })
    },
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", comment.postId] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "답글 작성 완료",
        description: "답글이 성공적으로 작성되었습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "답글 작성 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
