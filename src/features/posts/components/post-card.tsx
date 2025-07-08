"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react"
import { formatDate, getAgeGroupLabel, getCategoryLabel } from "@/lib/utils"
import { PostDetailModal } from "./post-detail-modal"
import type { Post } from "@/lib/schemas"

interface PostCardProps {
  post: Post & {
    author: {
      nickname: string
      avatar?: string
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleCardClick = () => {
    setShowDetailModal(true)
  }

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
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{post.content}</p>

            {post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {post.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    {index === 3 && post.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium">+{post.images.length - 4}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.map((tag, index) => (
                  <span key={index} className="text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike()
                  }}
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
                  <span className="text-xs">{post.commentCount}</span>
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBookmark()
                  }}
                  className={`${isBookmarked ? "text-yellow-500" : "text-gray-500"}`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500" onClick={(e) => e.stopPropagation()}>
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
