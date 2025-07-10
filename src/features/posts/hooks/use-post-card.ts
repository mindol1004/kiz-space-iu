
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/shared/stores/auth-store"
import { PostsAPI } from "../api/post-api"
import { Post } from "../types/post-type"

export function usePostCard(post: Post) {
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuthStore()

  const handleCardClick = () => {
    setShowDetailModal(true)
  }

  const getTruncatedContent = (maxLength: number = 100) => {
    if (post.content.length <= maxLength) {
      return post.content
    }
    return post.content.slice(0, maxLength) + "..."
  }

  const isOwner = user?.id === post.authorId

  // 게시글 좋아요 뮤테이션
  const likeMutation = useMutation({
    mutationFn: () => PostsAPI.likePost(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: (error: Error) => {
      toast({
        title: "좋아요 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // 게시글 북마크 뮤테이션
  const bookmarkMutation = useMutation({
    mutationFn: () => PostsAPI.bookmarkPost(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
    },
    onError: (error: Error) => {
      toast({
        title: "북마크 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // 게시글 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: () => PostsAPI.deletePost(post.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      setShowDeleteDialog(false)
      toast({
        title: "게시글 삭제 완료",
        description: "게시글이 성공적으로 삭제되었습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "게시글 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate()
  }

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
    likeMutation,
    bookmarkMutation,
    deleteMutation,
  }
}
