
"use client"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { PostsAPI } from "../api/post-api"
import { Post } from "../types/post-type"
import { useComments, useCreateComment } from "../../comments/hooks/use-comments"

export function usePostDetailModal(post: Post | null) {
  const [open, setOpen] = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  
  // 댓글 데이터 가져오기
  const { data: comments = [], isLoading: isLoadingComments } = useComments(post?.id || "")
  const createCommentMutation = useCreateComment()

  useEffect(() => {
    if (open && post) {
      // 게시글 조회수 증가
      PostsAPI.incrementViews(post.id).catch(console.error)
    }
  }, [open, post])

  const likeMutation = useMutation({
    mutationFn: () => PostsAPI.likePost(post!.id, user!.id),
    onSuccess: (data) => {
      queryClient.setQueryData(["post", post!.id], (oldData: Post) => ({
        ...oldData,
        isLiked: data.liked,
        likesCount: data.likesCount,
      }))
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  const bookmarkMutation = useMutation({
    mutationFn: () => PostsAPI.bookmarkPost(post!.id, user!.id),
    onSuccess: (data) => {
      queryClient.setQueryData(["post", post!.id], (oldData: Post) => ({
        ...oldData,
        isBookmarked: data.bookmarked,
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
    if (!post) return
    likeMutation.mutate()
  }

  const handleBookmark = () => {
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }
    if (!post) return
    bookmarkMutation.mutate()
  }

  const handleShare = () => {
    if (!post) return
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }
    if (!comment.trim() || !post) return
    
    createCommentMutation.mutate({
      content: comment,
      postId: post.id,
    }, {
      onSuccess: () => {
        setComment("")
      }
    })
  }

  return {
    open,
    setOpen,
    comment,
    setComment,
    handleLike,
    handleBookmark,
    handleShare,
    handleCommentSubmit,
    isLiking: likeMutation.isPending,
    isBookmarking: bookmarkMutation.isPending,
    isLiked: post?.isLiked || false,
    isBookmarked: post?.isBookmarked || false,
    likeCount: post?.likesCount || 0,
    comments,
    isLoadingComments,
    isSubmittingComment: createCommentMutation.isPending,
  }
}
