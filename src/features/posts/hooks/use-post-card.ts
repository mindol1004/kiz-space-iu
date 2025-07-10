"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { PostsAPI } from "../api/post-api"
import { Post } from "../types/post-type"

export function usePostCard(post: Post) {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: () => PostsAPI.likePost(post.id),
    onSuccess: (data) => {
      queryClient.setQueryData(["post", post.id], (oldData: Post) => ({
        ...oldData,
        isLiked: data.isLiked,
        likesCount: data.likesCount,
      }))
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const bookmarkMutation = useMutation({
    mutationFn: () => PostsAPI.bookmarkPost(post.id),
    onSuccess: (data) => {
      queryClient.setQueryData(["post", post.id], (oldData: Post) => ({
        ...oldData,
        isBookmarked: data.isBookmarked,
        bookmarksCount: data.bookmarksCount,
      }))
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const handleLike = () => {
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }
    likeMutation.mutate()
  }

  const handleBookmark = () => {
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }
    bookmarkMutation.mutate()
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "게시글 공유",
        text: post.content,
        url: window.location.href,
      })
    } else {
      // 폴백: 클립보드에 복사
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 클립보드에 복사되었습니다.")
    }
  }

  const getTruncatedContent = () => {
    const maxLength = 200
    if (post.content.length <= maxLength) return post.content
    return post.content.slice(0, maxLength) + "..."
  }

  return {
    handleLike,
    handleBookmark,
    handleShare,
    isLiking: likeMutation.isPending,
    isBookmarking: bookmarkMutation.isPending,
    getTruncatedContent,
  }
}