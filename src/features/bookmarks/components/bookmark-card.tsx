
"use client"

import { useState } from "react"
import { Heart, Share2, BookmarkX, MessageCircle, Eye, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRemoveBookmark } from "../hooks/use-bookmarks"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import { getCategoryLabel, getAgeGroupLabel } from "@/shared/constants/common-data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BookmarkCardProps {
  bookmark: any
  viewMode: "grid" | "list"
  index: number
}

export function BookmarkCard({ bookmark, viewMode, index }: BookmarkCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const removeBookmarkMutation = useRemoveBookmark()

  const post = bookmark.post
  if (!post) return null

  const handleLike = () => {
    setIsLiked(!isLiked)
    // TODO: API 호출로 좋아요 기능 구현
  }

  const handleRemoveBookmark = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    removeBookmarkMutation.mutate({ postId: post.id })
  }

  const handleShare = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.origin + `/posts/${post.id}`,
      })
    } else {
      navigator.clipboard.writeText(window.location.origin + `/posts/${post.id}`)
    }
  }

  const bookmarkedAt = formatDistanceToNow(new Date(bookmark.createdAt), {
    addSuffix: true,
    locale: ko,
  })

  const getTruncatedContent = () => {
    if (!post.content) return ""
    const maxLength = viewMode === "list" ? 100 : 150
    return post.content.length > maxLength 
      ? post.content.substring(0, maxLength) + "..."
      : post.content
  }

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -2 }}
        className="w-full cursor-pointer"
      >
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.author?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    {post.author?.nickname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{post.author?.nickname}</p>
                  <p className="text-xs text-gray-500">{formatDate(new Date(post.createdAt))}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleRemoveBookmark}
                    className="text-red-600 focus:text-red-600"
                  >
                    <BookmarkX className="h-4 w-4 mr-2" />
                    북마크 해제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{getCategoryLabel(post.category)}</Badge>
              <Badge variant="outline">{getAgeGroupLabel(post.ageGroup)}</Badge>
              <Badge variant="outline" className="text-xs text-pink-600 bg-pink-50">
                {bookmarkedAt} 저장
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{getTruncatedContent()}</p>

            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {post.images.slice(0, 4).map((image: string, idx: number) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    {idx === 3 && post.images && post.images.length > 4 && (
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
                {post.tags.slice(0, 3).map((tag: string, idx: number) => (
                  <span key={idx} className="text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLike()
                    }}
                    className={`flex items-center space-x-1 hover:bg-red-50 ${
                      isLiked ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    <motion.div 
                      whileTap={{ scale: 0.8 }} 
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    </motion.div>
                    <span className="text-xs">{post._count?.likes || 0}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 text-gray-500 hover:bg-blue-50"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{post._count?.comments || 0}</span>
                  </Button>

                  <div className="flex items-center space-x-1 text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">{post.viewsCount || 0}</span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 hover:bg-gray-50" 
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="w-full cursor-pointer"
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
        {post.images && post.images.length > 0 && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.images[0] || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  {post.author?.nickname?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{post.author?.nickname}</p>
                <p className="text-xs text-gray-500">{formatDate(new Date(post.createdAt))}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleRemoveBookmark}
                  className="text-red-600 focus:text-red-600"
                >
                  <BookmarkX className="h-4 w-4 mr-2" />
                  북마크 해제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{getCategoryLabel(post.category)}</Badge>
            <Badge variant="outline">{getAgeGroupLabel(post.ageGroup)}</Badge>
            <Badge variant="outline" className="text-xs text-pink-600 bg-pink-50">
              {bookmarkedAt} 저장
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">{getTruncatedContent()}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag: string, idx: number) => (
                <span key={idx} className="text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLike()
                  }}
                  className={`flex items-center space-x-1 hover:bg-red-50 ${
                    isLiked ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  <motion.div 
                    whileTap={{ scale: 0.8 }} 
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                  </motion.div>
                  <span className="text-xs">{post._count?.likes || 0}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-gray-500 hover:bg-blue-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{post._count?.comments || 0}</span>
                </Button>

                <div className="flex items-center space-x-1 text-gray-500">
                  <Eye className="h-4 w-4" />
                  <span className="text-xs">{post.viewsCount || 0}</span>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500 hover:bg-gray-50" 
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
