"use client"

import { useState } from "react"
import { Post } from "../types/post-type"

export function usePostCard(post: Post) {
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)

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

  return {
    showDetailModal,
    setShowDetailModal,
    handleCardClick,
    getTruncatedContent,
  }
}