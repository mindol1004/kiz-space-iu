"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  id: string
  content: string
  author: {
    id: string
    nickname: string
    avatar?: string
  }
  createdAt: Date
  postId: string
}

interface CreateCommentData {
  content: string
  postId: string
  authorId: string
  parentId?: string
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await fetch(`/api/comments?postId=${postId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "댓글을 불러오는데 실패했습니다")
      }

      return result.comments || []
    },
    enabled: !!postId,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: CreateCommentData) => {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "댓글 작성에 실패했습니다")
      }

      return result.comment
    },
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: ["comments", comment.postId] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "댓글 작성 완료",
        description: "댓글이 성공적으로 작성되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "댓글 작성 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
```export function useDeleteComment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "댓글 삭제에 실패했습니다")
      }

      return commentId
    },
    onSuccess: (commentId) => {
      queryClient.invalidateQueries({ queryKey: ["comments"] })
      toast({
        title: "댓글 삭제 완료",
        description: "댓글이 삭제되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "댓글 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}