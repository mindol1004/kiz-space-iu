import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PostsAPI } from "../api/post-api"
import { Post } from "../types/post-type"

export function usePostCard(post: Post) {
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const handleCardClick = () => {
    setShowDetailModal(true)
  }

  const getTruncatedContent = (maxLength: number = 150) => {
    if (post.content.length <= maxLength) {
      return post.content
    }
    return post.content.slice(0, maxLength) + "..."
  }

  const likeMutation = useMutation({
    mutationFn: () => PostsAPI.likePost(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const bookmarkMutation = useMutation({
    mutationFn: () => PostsAPI.bookmarkPost(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => PostsAPI.deletePost(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  return {
    showDetailModal,
    setShowDetailModal,
    handleCardClick,
    getTruncatedContent,
    likeMutation,
    bookmarkMutation,
    deleteMutation,
    isDeleting: deleteMutation.isPending,
    isLoading: likeMutation.isPending || bookmarkMutation.isPending,
  }
}