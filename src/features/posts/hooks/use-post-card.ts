
"use client"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useToast } from "@/hooks/use-toast"
import { Post, LikePostParams, BookmarkPostParams } from "../types/post-type"

export function usePostCard(post: Post) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false)
  const [likeCount, setLikeCount] = useState(post.likesCount || 0)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const { toast } = useToast()

  // post 데이터가 변경될 때 상태 업데이트
  useEffect(() => {
    setIsLiked(post.isLiked || false)
    setIsBookmarked(post.isBookmarked || false)
    setLikeCount(post.likesCount || 0)
  }, [post.isLiked, post.isBookmarked, post.likesCount])

  const likePostMutation = useMutation({
    mutationFn: async ({ postId, userId }: LikePostParams) => {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to like post")
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      // 모든 posts 쿼리 키에 대해 데이터 업데이트
      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) => 
              post.id === variables.postId 
                ? { 
                    ...post, 
                    isLiked: data.liked,
                    likesCount: data.likesCount 
                  }
                : post
            )
          }))
        }
      })

      // 개별 post 쿼리도 업데이트
      queryClient.setQueryData(["post", variables.postId], (oldPost: any) => {
        if (!oldPost) return oldPost
        return {
          ...oldPost,
          isLiked: data.liked,
          likesCount: data.likesCount
        }
      })
    },
  })

  const bookmarkPostMutation = useMutation({
    mutationFn: async ({ postId, userId }: BookmarkPostParams) => {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to bookmark post")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "좋아요를 누르려면 로그인이 필요합니다.",
        variant: "destructive"
      })
      return
    }

    if (likePostMutation.isPending) {
      return
    }

    const previousIsLiked = isLiked
    const previousLikeCount = likeCount

    // 낙관적 업데이트
    const newIsLiked = !isLiked
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1

    setIsLiked(newIsLiked)
    setLikeCount(newLikeCount)

    try {
      const result = await likePostMutation.mutateAsync({
        postId: post.id,
        userId: user.id,
      })

      if (result.liked !== newIsLiked || result.likesCount !== newLikeCount) {
        setIsLiked(result.liked)
        setLikeCount(result.likesCount)
      }
    } catch (error) {
      setIsLiked(previousIsLiked)
      setLikeCount(previousLikeCount)
      toast({
        title: "오류 발생",
        description: "좋아요 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "북마크를 추가하려면 로그인이 필요합니다.",
        variant: "destructive"
      })
      return
    }

    const previousIsBookmarked = isBookmarked

    setIsBookmarked(!isBookmarked)

    try {
      await bookmarkPostMutation.mutateAsync({
        postId: post.id,
        userId: user.id,
      })

      toast({
        title: isBookmarked ? "북마크 해제" : "북마크 추가",
        description: isBookmarked ? "북마크에서 제거되었습니다." : "북마크에 추가되었습니다.",
      })
    } catch (error) {
      setIsBookmarked(previousIsBookmarked)
      toast({
        title: "오류 발생",
        description: "북마크 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.author.nickname}님의 게시글`,
          text: post.content.slice(0, 100) + (post.content.length > 100 ? '...' : ''),
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "링크 복사됨",
          description: "게시글 링크가 클립보드에 복사되었습니다.",
        })
      } catch (error) {
        toast({
          title: "복사 실패",
          description: "링크 복사에 실패했습니다.",
          variant: "destructive"
        })
      }
    }
  }

  const handleCardClick = () => {
    setShowDetailModal(true)
  }

  const getTruncatedContent = () => {
    return post.content.length > 150 
      ? post.content.slice(0, 150) + '...' 
      : post.content
  }

  return {
    isLiked,
    isBookmarked,
    likeCount,
    showDetailModal,
    setShowDetailModal,
    handleLike,
    handleBookmark,
    handleShare,
    handleCardClick,
    getTruncatedContent,
    isLoading: likePostMutation.isPending || bookmarkPostMutation.isPending,
  }
}
