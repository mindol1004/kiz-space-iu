
"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Calendar } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"
import { getCategoryLabel } from "@/shared/constants/common-data"
import { useRemoveBookmark } from "../hooks/use-bookmarks"

interface BookmarkCardProps {
  bookmark: any // 실제 API 응답 구조에 맞게 수정
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

  if (viewMode === "list") {
    return (
      <Card
        className="hover:shadow-md transition-all duration-300 animate-in slide-in-from-left"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            {post.images && post.images.length > 0 && (
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={post.images[0] || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <Badge className={`mb-2 ${getCategoryColor(post.category)}`}>
                    {getCategoryLabel(post.category)}
                  </Badge>
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      공유하기
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleRemoveBookmark} className="text-red-600">
                      <Bookmark className="h-4 w-4 mr-2" />
                      북마크 해제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{post.author.nickname[0]}</AvatarFallback>
                    </Avatar>
                    <span>{post.author.nickname}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(new Date(bookmark.createdAt))}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
                    <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                    {post._count?.likes || 0}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post._count?.comments || 0}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Badge className={getCategoryColor(post.category)}>{getCategoryLabel(post.category)}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                공유하기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRemoveBookmark} className="text-red-600">
                <Bookmark className="h-4 w-4 mr-2" />
                북마크 해제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {post.images && post.images.length > 0 && (
          <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
            <img
              src={post.images[0] || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{post.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.content}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
            <AvatarFallback>{post.author.nickname[0]}</AvatarFallback>
          </Avatar>
          <span>{post.author.nickname}</span>
          <span>•</span>
          <span>{formatDate(new Date(bookmark.createdAt))}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              {post._count?.likes || 0}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post._count?.comments || 0}
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
