
"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, UserPlus, UserMinus } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { PostDetailModal } from "./post-detail-modal"
import { EditPostModal } from "./edit-post-modal"
import { usePostCard } from "../hooks/use-post-card"
import { Post } from "../types/post-type"
import { getCategoryLabel, getAgeGroupLabel } from "@/shared/constants/common-data"
import { PostActions } from "./post-actions"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Trash2, Loader2, Edit } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { useFollowUser } from "@/features/users/hooks/use-follow-user"
import { useAddBookmark, useRemoveBookmark } from "@/features/bookmarks/hooks/use-bookmarks"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const {
    showDetailModal,
    setShowDetailModal,
    showDeleteDialog,
    setShowDeleteDialog,
    showEditModal,
    setShowEditModal,
    handleCardClick,
    getTruncatedContent,
    handleDelete,
    isOwner,
    isDeleting,
  } = usePostCard(post)

  const { user: currentUser } = useAuth()
  const { follow, unfollow, isFollowing, isUnfollowing } = useFollowUser()
  const addBookmarkMutation = useAddBookmark()
  const removeBookmarkMutation = useRemoveBookmark()
  
  // 북마크 상태 관리
  const [localBookmarkState, setLocalBookmarkState] = React.useState(post.isBookmarkedByCurrentUser)
  
  // 로컬 상태로 팔로우 상태 관리
  const [localFollowState, setLocalFollowState] = React.useState(post.isFollowedByCurrentUser)
  
  // post.isFollowedByCurrentUser가 변경될 때 로컬 상태 동기화
  React.useEffect(() => {
    setLocalFollowState(post.isFollowedByCurrentUser)
  }, [post.isFollowedByCurrentUser])

  // post.isBookmarkedByCurrentUser가 변경될 때 로컬 상태 동기화
  React.useEffect(() => {
    setLocalBookmarkState(post.isBookmarkedByCurrentUser)
  }, [post.isBookmarkedByCurrentUser])

  // 북마크/북마크 해제 핸들러
  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!currentUser) {
      alert("로그인이 필요합니다.")
      return
    }

    try {
      if (localBookmarkState) {
        // 북마크 해제
        setLocalBookmarkState(false)
        removeBookmarkMutation.mutate({ postId: post.id })
      } else {
        // 북마크 추가
        setLocalBookmarkState(true)
        addBookmarkMutation.mutate({ postId: post.id, category: post.category })
      }
    } catch (error) {
      // 에러 시 상태 되돌리기
      setLocalBookmarkState(post.isBookmarkedByCurrentUser)
    }
  }

  // 팔로우/언팔로우 핸들러
  const handleFollowClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!currentUser) {
      alert("로그인이 필요합니다.")
      return
    }

    try {
      if (localFollowState) {
        // 언팔로우
        setLocalFollowState(false)
        unfollow(post.author.id)
      } else {
        // 팔로우
        setLocalFollowState(true)
        follow(post.author.id)
      }
    } catch (error) {
      // 에러 시 상태 되돌리기
      setLocalFollowState(post.isFollowedByCurrentUser)
    }
  }

  const isMyPost = currentUser?.id === post.author.id
  const isProcessingFollow = isFollowing || isUnfollowing
  const isProcessingBookmark = addBookmarkMutation.isPending || removeBookmarkMutation.isPending
  const truncatedContent = getTruncatedContent()

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
        className="w-full cursor-pointer"
        onClick={handleCardClick}
      >
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    {post.author.nickname[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{post.author.nickname}</p>
                    {!isMyPost && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleFollowClick}
                        disabled={isProcessingFollow}
                        className={`h-6 px-2 text-xs ${
                          localFollowState 
                            ? "text-gray-600 hover:text-red-600" 
                            : "text-blue-600 hover:text-blue-700"
                        }`}
                      >
                        {isProcessingFollow ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : localFollowState ? (
                          <>
                            <UserMinus className="h-3 w-3 mr-1" />
                            언팔로우
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3 w-3 mr-1" />
                            팔로우
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(new Date(post.createdAt))}</p>
                </div>
              </div>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowEditModal(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDeleteDialog(true)
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{getCategoryLabel(post.category)}</Badge>
              <Badge variant="outline">{getAgeGroupLabel(post.ageGroup)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{truncatedContent}</p>

            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {post.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    {index === 3 && post.images && post.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">+{post.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    +{post.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="pt-3 border-t">
              <PostActions 
                post={post} 
                variant="card"
                onCommentClick={(e) => e?.stopPropagation()}
                onBookmarkClick={handleBookmarkClick}
                isBookmarked={localBookmarkState}
                isProcessingBookmark={isProcessingBookmark}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <PostDetailModal post={post} open={showDetailModal} onOpenChange={setShowDetailModal} />
      <EditPostModal post={post} open={showEditModal} onOpenChange={setShowEditModal} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  삭제 중...
                </>
              ) : (
                "삭제"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
