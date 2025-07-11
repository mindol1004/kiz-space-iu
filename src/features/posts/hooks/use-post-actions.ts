import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { PostsAPI } from "../api/post-api"
import { Post, LikeApiResponse, BookmarkApiResponse, ViewsApiResponse } from "../types/post-type"
import { useEffect, useState } from "react"

// Mutation context 타입 정의
interface MutationContext {
  previousState: {
    isLiked: boolean;
    isBookmarked: boolean;
    likeCount: number;
    bookmarksCount: number;
    viewsCount: number;
  };
}

export function usePostActions(post: Post) {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  
  const [localState, setLocalState] = useState({
    isLiked: post.isLiked || false,
    isBookmarked: post.isBookmarked || false,
    likeCount: post.likesCount || 0,
    bookmarksCount: post.bookmarksCount || 0,
    viewsCount: post.viewsCount || 0,
  })

  // 좋아요 뮤테이션
  const likeMutation = useMutation<LikeApiResponse, Error, void, MutationContext>({
    mutationFn: () => PostsAPI.likePost(post.id),
    onMutate: async () => {
      const previousState = { ...localState }
      const newIsLiked = !localState.isLiked
      const newLikeCount = newIsLiked ? localState.likeCount + 1 : localState.likeCount - 1

      setLocalState(prev => ({
        ...prev,
        isLiked: newIsLiked,
        likeCount: Math.max(0, newLikeCount), // 0 이하로 떨어지지 않도록
      }))

      return { previousState }
    },
    onError: (error, _, context) => {
      console.error("좋아요 처리 중 오류:", error)
      
      // 에러 시 이전 상태로 복구
      if (context?.previousState) {
        setLocalState(context.previousState)
      }
    },
    onSuccess: (data) => {
      if (data && data.success) {
        // 서버 응답으로 상태 업데이트
        setLocalState(prev => ({
          ...prev,
          isLiked: data.liked,
          likeCount: data.likesCount,
        }))

        // 개별 게시글 캐시 업데이트
        queryClient.setQueryData(["post", post.id], (oldData: Post | undefined) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            isLiked: data.liked,
            likesCount: data.likesCount,
          }
        })

        // 게시글 목록 캐시 업데이트
        queryClient.setQueriesData(
          { queryKey: ["posts"] },
          (oldData: any) => {
            if (!oldData?.pages) return oldData

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                posts: page.posts.map((p: Post) => 
                  p.id === post.id 
                    ? { ...p, isLiked: data.liked, likesCount: data.likesCount }
                    : p
                )
              }))
            }
          }
        )
      }
    },
  })

  // 북마크 뮤테이션
  const bookmarkMutation = useMutation<BookmarkApiResponse, Error, void, MutationContext>({
    mutationFn: () => PostsAPI.bookmarkPost(post.id),
    onMutate: async () => {
      const previousState = { ...localState }
      const newIsBookmarked = !localState.isBookmarked

      setLocalState(prev => ({
        ...prev,
        isBookmarked: newIsBookmarked,
      }))

      return { previousState }
    },
    onError: (error, _, context) => {
      console.error("북마크 처리 중 오류:", error)
      
      // 에러 시 이전 상태로 복구
      if (context?.previousState) {
        setLocalState(context.previousState)
      }
    },
    onSuccess: (data) => {
      if (data && data.success) {
        // 서버 응답으로 상태 업데이트
        setLocalState(prev => ({
          ...prev,
          isBookmarked: data.isBookmarked,
          bookmarksCount: data.bookmarksCount,
        }))

        // 개별 게시글 캐시 업데이트
        queryClient.setQueryData(["post", post.id], (oldData: Post | undefined) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            isBookmarked: data.isBookmarked,
            bookmarksCount: data.bookmarksCount,
          }
        })

        // 게시글 목록 캐시 업데이트
        queryClient.setQueriesData(
          { queryKey: ["posts"] },
          (oldData: any) => {
            if (!oldData?.pages) return oldData

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                posts: page.posts.map((p: Post) => 
                  p.id === post.id 
                    ? { ...p, isBookmarked: data.isBookmarked, bookmarksCount: data.bookmarksCount }
                    : p
                )
              }))
            }
          }
        )
      }
    },
  })

  // 조회수 뮤테이션
  const viewMutation = useMutation<ViewsApiResponse, Error, void>({
    mutationFn: () => PostsAPI.incrementViews(post.id, user?.id),
    onSuccess: (data) => {
      if (data && data.viewsCount) {
        setLocalState(prev => ({
          ...prev,
          viewsCount: data.viewsCount,
        }))

        // 캐시 업데이트
        queryClient.setQueryData(["post", post.id], (oldData: Post | undefined) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            viewsCount: data.viewsCount,
          }
        })
      }
    },
  })

  // 게시글 데이터가 변경될 때 로컬 상태 동기화
  useEffect(() => {
    // 뮤테이션 진행 중이 아닐 때만 상태 동기화
    if (!likeMutation.isPending && !bookmarkMutation.isPending) {
      setLocalState({
        isLiked: post.isLiked || false,
        isBookmarked: post.isBookmarked || false,
        likeCount: post.likesCount || 0,
        bookmarksCount: post.bookmarksCount || 0,
        viewsCount: post.viewsCount || 0,
      })
    }
  }, [
    post.isLiked, 
    post.isBookmarked, 
    post.likesCount, 
    post.bookmarksCount, 
    post.viewsCount, 
    likeMutation.isPending, 
    bookmarkMutation.isPending
  ])

  // 이벤트 핸들러들
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
    
    const currentUrl = window.location.href
    const shareData = {
      title: "게시글 공유",
      text: post.content?.substring(0, 100) + "...",
      url: currentUrl,
    }

    if (navigator.share && navigator.canShare?.(shareData)) {
      navigator.share(shareData)
        .catch((error) => {
          console.error("공유 실패:", error)
          fallbackCopyToClipboard(currentUrl)
        })
    } else {
      fallbackCopyToClipboard(currentUrl)
    }
  }

  const fallbackCopyToClipboard = (url: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => alert("링크가 클립보드에 복사되었습니다."))
        .catch(() => alert("링크 복사에 실패했습니다."))
    } else {
      // 구형 브라우저 지원
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        alert("링크가 클립보드에 복사되었습니다.")
      } catch (err) {
        alert("링크 복사에 실패했습니다.")
      }
      document.body.removeChild(textArea)
    }
  }

  const incrementViews = () => {
    if (user && viewMutation.isIdle) {
      viewMutation.mutate()
    }
  }

  return {
    isLiked: localState.isLiked,
    isBookmarked: localState.isBookmarked,
    likeCount: localState.likeCount,
    bookmarksCount: localState.bookmarksCount,
    viewsCount: localState.viewsCount,
    handleLike,
    handleBookmark,
    handleShare,
    incrementViews,
    isLoading: likeMutation.isPending || bookmarkMutation.isPending,
  }
}