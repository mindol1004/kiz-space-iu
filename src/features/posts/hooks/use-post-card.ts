
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useToast } from "@/hooks/use-toast"
import { PostsAPI } from "../api/post-api"
import { Post } from "../types/post-type"

export function usePostCard(post: Post) {
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const { user } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleCardClick = () => {
    setShowDetailModal(true)
  }

  const getTruncatedContent = () => {
    const maxLength = 120
    if (post.content.length <= maxLength) {
      return post.content
    }
    return post.content.slice(0, maxLength) + "..."
  }

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      await PostsAPI.deletePost(postId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "게시글 삭제 완료",
        description: "게시글이 성공적으로 삭제되었습니다.",
      })
      setShowDeleteDialog(false)
    },
    onError: (error: Error) => {
      toast({
        title: "게시글 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleDelete = () => {
    if (post.id) {
      deleteMutation.mutate(post.id)
    }
  }

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
