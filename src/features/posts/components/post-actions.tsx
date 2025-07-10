"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bookmark, Share2, Eye } from "lucide-react"
import { usePostActions } from "../hooks/use-post-actions"
import { Post } from "../types/post-type"

interface PostActionsProps {
  post: Post
  variant?: "card" | "modal"
  onCommentClick?: (e?: React.MouseEvent) => void
  commentsCount?: number
}

export function PostActions({ post, variant = "card", onCommentClick, commentsCount }: PostActionsProps) {
  const {
    isLiked,
    isBookmarked,
    likeCount,
    viewsCount,
    handleLike,
    handleBookmark,
    handleShare,
    isLoading,
  } = usePostActions(post)

  const iconSize = variant === "modal" ? "h-5 w-5" : "h-4 w-4"
  const textSize = variant === "modal" ? "text-sm" : "text-xs"

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center space-x-1 ${isLiked ? "text-red-500" : "text-gray-500"}`}
        >
          <motion.div whileTap={{ scale: 0.8 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
            <Heart className={`${iconSize} ${isLiked ? "fill-current" : ""}`} />
          </motion.div>
          <span className={textSize}>{likeCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center space-x-1 text-gray-500`}
          onClick={onCommentClick}
        >
          <MessageCircle className={iconSize} />
          <span className={textSize}>{commentsCount || post.commentsCount || 0}</span>
        </Button>

        {viewsCount !== undefined && (
          <div className="flex items-center space-x-1 text-gray-500">
            <Eye className={iconSize} />
            <span className={textSize}>{viewsCount}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          disabled={isLoading}
          className={`${isBookmarked ? "text-yellow-500" : "text-gray-500"}`}
        >
          <Bookmark className={`${iconSize} ${isBookmarked ? "fill-current" : ""}`} />
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-500" onClick={handleShare}>
          <Share2 className={iconSize} />
        </Button>
      </div>
    </div>
  )
}