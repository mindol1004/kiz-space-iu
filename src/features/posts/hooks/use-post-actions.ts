import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { PostsAPI } from "../api/post-api"
import { Post } from "../types/post-type"
import { useEffect, useState } from "react"

export function usePostActions(post: Post) {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [localState, setLocalState] = useState({
    isLiked: post.isLiked || false,
    isBookmarked: post.isBookmarked || false,
    likeCount: post.likesCount || 0,
    viewsCount: post.viewsCount || 0,
  })

  // 게시글 데이터가 변경될 때 로컬 상태 동기화
  useEffect(() => {
    setLocalState({
      isLiked: post.isLiked || false,
      isBookmarked: post.isBookmarked || false,
      likeCount: post.likesCount || 0,
      viewsCount: post.viewsCount || 0,
    })
  }, [post.isLiked, post.isBookmarked, post.likesCount, post.viewsCount])

  const likeMutation = useMutation({
    mutationFn: () => PostsAPI.likePost(post.id),
    onMutate: async () => {
      // 낙관적 업데이트
      const newIsLiked = !localState.isLiked
      const newLikeCount = newIsLiked ? localState.likeCount + 1 : localState.likeCount - 1

      setLocalState(prev => ({
        ...prev,
        isLiked: newIsLiked,
        likeCount: newLikeCount,
      }))

      return { previousState: localState }
    },
    onError: (err, variables, context) => {
      // 에러 시 이전 상태로 되돌리기
      if (context?.previousState) {
        setLocalState(context.previousState)
      }
    },
    onSuccess: (data) => {
      // 서버 응답으로 최종 상태 업데이트
      setLocalState(prev => ({
        ...prev,
        isLiked: data.liked,
        likeCount: data.likesCount,
      }))

      // 캐시 업데이트
      queryClient.setQueryData(["post", post.id], (oldData: Post) => ({
        ...oldData,
        isLiked: data.liked,
        likesCount: data.likesCount,
      }))
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const bookmarkMutation = useMutation({
    mutationFn: () => PostsAPI.bookmarkPost(post.id),
    onMutate: async () => {
      // 낙관적 업데이트
      const newIsBookmarked = !localState.isBookmarked

      setLocalState(prev => ({
        ...prev,
        isBookmarked: newIsBookmarked,
      }))

      return { previousState: localState }
    },
    onError: (err, variables, context) => {
      // 에러 시 이전 상태로 되돌리기
      if (context?.previousState) {
        setLocalState(context.previousState)
      }
    },
    onSuccess: (data) => {
      // 서버 응답으로 최종 상태 업데이트
      setLocalState(prev => ({
        ...prev,
        isBookmarked: data.bookmarked,
      }))

      // 캐시 업데이트
      queryClient.setQueryData(["post", post.id], (oldData: Post) => ({
        ...oldData,
        isBookmarked: data.bookmarked,
        bookmarksCount: data.bookmarksCount,
      }))
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const viewMutation = useMutation({
    mutationFn: () => PostsAPI.incrementViews(post.id, user?.id),
    onSuccess: (data) => {
      setLocalState(prev => ({
        ...prev,
        viewsCount: data.viewsCount,
      }))

      // 캐시 업데이트
      queryClient.setQueryData(["post", post.id], (oldData: Post) => ({
        ...oldData,
        viewsCount: data.viewsCount,
      }))
    },
  })

  const handleLike = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }
    likeMutation.mutate()
  }

  const handleBookmark = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }
    bookmarkMutation.mutate()
  }

  const handleShare = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: "게시글 공유",
        text: post.content,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 클립보드에 복사되었습니다.")
    }
  }

  const incrementViews = () => {
    if (user) {
      viewMutation.mutate()
    }
  }

  return {
    isLiked: localState.isLiked,
    isBookmarked: localState.isBookmarked,
    likeCount: localState.likeCount,
    viewsCount: localState.viewsCount,
    handleLike,
    handleBookmark,
    handleShare,
    incrementViews,
    isLoading: likeMutation.isPending || bookmarkMutation.isPending,
  }
}