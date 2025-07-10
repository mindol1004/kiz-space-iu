"use client"

import { useState } from "react"
import { Post } from "../types/post-type"

export function usePostCard(post: Post) {
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)atioconst handleCardClick = () => {
    setShowDetailModal(true)
  }

  const getTruncatedContent = () => {
    const maxLength = 200
    if (post.content.length <= maxLength) return post.content
    return post.content.slice(0, maxLength) + "..."
  }

  return {
    showDetailModal,
    setShowDetailModal,
    handleCardClick,
    getTruncatedContent,
  }Mutation.isPending,
    isLoading: likeMutation.isPending || bookmarkMutation.isPending,
  }
}