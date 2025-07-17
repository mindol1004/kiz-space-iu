
"use client"

import { useState } from "react"
import { Heart, Share2, BookmarkX, MessageCircle, Eye } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRemoveBookmark } from "../hooks/use-bookmarks"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

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

  const handleRemoveBookmark = () => {
    removeBookmarkMutation.mutate({ postId: post.id })
  }

  const handleShare = () => {
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

  const getCategoryColor = (category: string) => {
    const colors = {
      pregnancy: "bg-pink-100 text-pink-800",
      newborn: "bg-blue-100 text-blue-800",
      education: "bg-green-100 text-green-800",
      health: "bg-red-100 text-red-800",
      tips: "bg-yellow-100 text-yellow-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const bookmarkedAt = formatDistanceToNow(new Date(bookmark.createdAt), {
    addSuffix: true,
    locale: ko,
  })

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {post.image && (
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(post.category)} variant="secondary">
                  {post.category}
                </Badge>
                <span className="text-sm text-gray-500">{bookmarkedAt} 저장</span>
              </div>
              <h3 className="font-semibold text-lg line-clamp-2">{post.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={post.author?.avatar} />
                    <AvatarFallback>{post.author?.nickname?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{post.author?.nickname}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.viewsCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {post._count?.likes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {post._count?.comments || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveBookmark}
              className="text-red-500 hover:text-red-700"
            >
              <BookmarkX className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      {post.image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={getCategoryColor(post.category)} variant="secondary">
            {post.category}
          </Badge>
          <span className="text-xs text-gray-500">{bookmarkedAt} 저장</span>
        </div>
        <h3 className="font-semibold text-lg line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author?.avatar} />
            <AvatarFallback>{post.author?.nickname?.[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{post.author?.nickname}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.viewsCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {post._count?.likes || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post._count?.comments || 0}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={isLiked ? "text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveBookmark}
            className="text-red-500 hover:text-red-700"
          >
            <BookmarkX className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
