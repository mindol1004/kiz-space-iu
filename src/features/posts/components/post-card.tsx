
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Eye } from "lucide-react"
import { formatDate, getAgeGroupLabel, getCategoryLabel } from "@/lib/utils"
import { PostDetailModal } from "./post-detail-modal"
import { useLikePost, useBookmarkPost } from "../hooks/use-posts"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useToast } from "@/hooks/use-toast"
import type { PostWithAuthor } from "@/lib/schemas"

interface PostCardProps {
  post: PostWithAuthor
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false)
  const [likeCount, setLikeCount] = useState(post.likesCount || 0)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const likePostMutation = useLikePost()
  const bookmarkPostMutation = useBookmarkPost()
  const { user } = useAuthStore()
  const { toast } = useToast()

  // post 데이터가 변경될 때 상태 업데이트
  useEffect(() => {
    setIsLiked(post.isLiked || false)
    setIsBookmarked(post.isBookmarked || false)
    setLikeCount(post.likesCount || 0)
  }, [post.isLiked, post.isBookmarked, post.likesCount])

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

    // 이미 요청 중이면 무시
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
      
      // API 응답이 낙관적 업데이트와 다를 경우에만 상태 조정
      if (result.liked !== newIsLiked || result.likesCount !== newLikeCount) {
        setIsLiked(result.liked)
        setLikeCount(result.likesCount)
      }
    } catch (error) {
      // 에러 발생 시 원래 상태로 롤백
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

    // 낙관적 업데이트
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
      // 에러 발생 시 원래 상태로 롤백
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
      // 웹 공유 API를 지원하지 않는 경우 클립보드에 복사
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

  const truncatedContent = post.content.length > 150 
    ? post.content.slice(0, 150) + '...' 
    : post.content

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
                  <p className="font-medium text-sm">{post.author.nickname}</p>
                  <p className="text-xs text-gray-500">{formatDate(new Date(post.createdAt))}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {getCategoryLabel(post.category)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getAgeGroupLabel(post.ageGroup)}
              </Badge>
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

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  disabled={likePostMutation.isPending}
                  className={`flex items-center space-x-1 ${isLiked ? "text-red-500" : "text-gray-500"}`}
                >
                  <motion.div whileTap={{ scale: 0.8 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  </motion.div>
                  <span className="text-xs">{likeCount}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-gray-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{post.commentCount || post.commentsCount || 0}</span>
                </Button>
                {post.viewsCount !== undefined && (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">{post.viewsCount}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  disabled={bookmarkPostMutation.isPending}
                  className={`${isBookmarked ? "text-yellow-500" : "text-gray-500"}`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <PostDetailModal post={post} open={showDetailModal} onOpenChange={setShowDetailModal} />
    </>
  )
}
