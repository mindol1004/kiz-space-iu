
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { PostsAPI } from "../api/post-api"
import { Post } from "../types/post-type"

export function usePostCard(post: Post) {
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const handleCardClick = () => {
    setShowDetailModal(true)
  }

  const getTruncatedContent = () => {
    const maxLength = 150
    if (post.content.length <= maxLength) {
      return post.content
    }
    return post.content.slice(0, maxLength) + "..."
  }

  const deleteMutation = useMutation({
    mutationFn: () => PostsAPI.deletePost(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      setShowDeleteDialog(false)
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  const isOwner = user?.id === post.authorId
  const isDeleting = deleteMutation.isPending

  return {
    showDetailModal,
    setShowDetailModal,
    showDeleteDialog,
    setShowDeleteDialog,
    showEditModal,
    setShowEditModal,
    handleCardClick,
    getTruncatedContent,
    handleDelete,
    isOwner,
    isDeleting,
  }
}
