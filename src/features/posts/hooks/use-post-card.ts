
"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useToast } from "@/hooks/use-toast"
import { Post } from "../types/post-type"
import { PostsAPI } from "../api/post-api"

export function usePostCard(post: Post) {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const handleCardClick = () => {
    setShowDetailModal(true)
  }

  const getTruncatedContent = (maxLength: number = 150) => {
    if (post.content.length <= maxLength) {
      return post.content
    } else {
      return post.content.slice(0, maxLength) + "..."
    }
  }

  // 게시글 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "게시글 삭제에 실패했습니다")
      }

      return post.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "게시글 삭제 완료",
        description: "게시글이 삭제되었습니다.",
      })
      setShowDeleteDialog(false)
    },
    onError: (error) => {
      toast({
        title: "게시글 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  // 현재 사용자가 게시글 작성자인지 확인
  const isOwner = user?.id === post.author.id

  return {
    showDetailModal,
    setShowDetailModal,
    showDeleteDialog,
    setShowDeleteDialog,
    handleCardClick,
    getTruncatedContent,
    handleDelete,
    isOwner,
    isDeleting: deleteMutation.isPending,
  }
}
