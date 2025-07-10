"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { PostDetailModal } from "./post-detail-modal"
import { usePostCard } from "../hooks/use-post-card"
import { Post } from "../types/post-type"
import { getCategoryLabel, getAgeGroupLabel } from "@/shared/constants/common-data"
import { PostActions } from "./post-actions"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const {
    showDetailModal,
    setShowDetailModal,
    handleCardClick,
    getTruncatedContent,
  } = usePostCard(post)

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
                  <p className="font-medium text-sm">{post.author.nickname}</p>
                  <p className="text-xs text-gray-500">{formatDate(new Date(post.createdAt))}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
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
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <PostDetailModal post={post} open={showDetailModal} onOpenChange={setShowDetailModal} />
    </>
  )
}