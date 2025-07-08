"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Calendar } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { BookmarkItem } from "../types/bookmark-types"

interface BookmarkCardProps {
  bookmark: BookmarkItem
  viewMode: "grid" | "list"
  index: number
}

export function BookmarkCard({ bookmark, viewMode, index }: BookmarkCardProps) {
  const [isLiked, setIsLiked] = useState(bookmark.isLiked)
  const [likeCount, setLikeCount] = useState(bookmark.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleRemoveBookmark = () => {
    // TODO: Implement remove bookmark functionality
    console.log("Remove bookmark:", bookmark.id)
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share bookmark:", bookmark.id)
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

  const getCategoryLabel = (category: string) => {
    const labels = {
      pregnancy: "임신",
      newborn: "신생아",
      education: "교육",
      health: "건강",
      tips: "팁",
    }
    return labels[category as keyof typeof labels] || category
  }

  if (viewMode === "list") {
    return (
      <Card
        className="hover:shadow-md transition-all duration-300 animate-in slide-in-from-left"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            {bookmark.image && (
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={bookmark.image || "/placeholder.svg"}
                  alt={bookmark.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <Badge className={`mb-2 ${getCategoryColor(bookmark.category)}`}>
                    {getCategoryLabel(bookmark.category)}
                  </Badge>
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2">{bookmark.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">{bookmark.content}</p>
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
                      <AvatarImage src={bookmark.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{bookmark.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{bookmark.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{bookmark.bookmarkedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
                    <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                    {likeCount}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {bookmark.comments}
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
          <Badge className={getCategoryColor(bookmark.category)}>{getCategoryLabel(bookmark.category)}</Badge>
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
        {bookmark.image && (
          <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
            <img
              src={bookmark.image || "/placeholder.svg"}
              alt={bookmark.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{bookmark.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{bookmark.content}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={bookmark.author.avatar || "/placeholder.svg"} />
            <AvatarFallback>{bookmark.author.name[0]}</AvatarFallback>
          </Avatar>
          <span>{bookmark.author.name}</span>
          <span>•</span>
          <span>{bookmark.bookmarkedAt}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              {likeCount}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              {bookmark.comments}
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
