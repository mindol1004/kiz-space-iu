"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface CreateCommentData {
  content: string
  postId: string
  authorId: string
  parentId?: string
}

export function useComments(postId: string) {
  const [comments, setComments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "댓글을 불러오는데 실패했습니다")
      }

      setComments(result.comments)
    } catch (error) {
      setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId])

  return {
    comments,
    isLoading,
    error,
    refetch: fetchComments,
  }
}

export function useCreateComment() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const createComment = async (data: CreateCommentData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "댓글 작성에 실패했습니다")
      }

      toast({
        title: "댓글 작성 완료",
        description: "댓글이 성공적으로 작성되었습니다.",
      })

      return result.comment
    } catch (error) {
      toast({
        title: "댓글 작성 실패",
        description: error instanceof Error ? error.message : "댓글 작성 중 오류가 발생했습니다",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createComment,
    isLoading,
  }
}
