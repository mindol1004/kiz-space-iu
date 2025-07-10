"use client"

import { useState } from "react"
import { useDeletePost } from "./use-posts-list"
import { useAuthStore } from "@/shared/stores/auth-store"
import { Post } from "../types/post-type"

export function usePostCard(post: Post) {
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const { user } = useAuthStore()
  const deleteMutation = useDeletePost()

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

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(post.id)
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Delete failed:", error)
    }
  }

  const isOwner = user?.id === post.authorId
  const isDeleting = deleteMutation.isPending

  return {
    showDetailModal,
    setShowDetailModal,
    showDeleteDialog,
    setShowDeleteDialog,
    handleCardClick,
    getTruncatedContent,
    handleDelete,
    isOwner,
    isDeleting,
  }
}