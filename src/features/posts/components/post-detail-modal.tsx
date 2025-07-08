"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Bookmark, Share2, Send } from "lucide-react"
import { formatDate, getAgeGroupLabel, getCategoryLabel } from "@/lib/utils"
import type { Post } from "@/lib/schemas"

interface PostDetailModalProps {
  post: Post & {
    author: {
      nickname: string
      avatar?: string
    }
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostDetailModal({ post, open, onOpenChange }: PostDetailModalProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([
    {
      id: "1",
      content: "정말 유용한 정보네요! 감사합니다 ㅎㅎ",
      author: { nickname: "김엄마", avatar: "/placeholder.svg" },
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      likes: 2,
    },
    {
      id: "2",
      content: "저도 비슷한 경험이 있어요. 공감됩니다!",
      author: { nickname: "이엄마", avatar: "/placeholder.svg" },
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
      likes: 1,
    },
  ])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now().toString(),
        content: comment.trim(),
        author: { nickname: "나", avatar: "/placeholder.svg" },
        createdAt: new Date(),
        likes: 0,
      }
      setComments((prev) => [...prev, newComment])
      setComment("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>게시글 상세</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* 게시글 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  {post.author.nickname[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.nickname}</p>
                <p className="text-sm text-gray-500">{formatDate(new Date(post.createdAt))}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{getCategoryLabel(post.category)}</Badge>
              <Badge variant="outline">{getAgeGroupLabel(post.ageGroup)}</Badge>
            </div>
          </div>

          {/* 게시글 내용 */}
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">{post.content}</p>

            {post.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {post.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="text-sm text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center justify-between py-3 border-t border-b">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center space-x-2 ${isLiked ? "text-red-500" : "text-gray-500"}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                <span>{likeCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-500">
                <MessageCircle className="h-5 w-5" />
                <span>{comments.length}</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`${isBookmarked ? "text-yellow-500" : "text-gray-500"}`}
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            <h3 className="font-medium">댓글 {comments.length}개</h3>
            <AnimatePresence>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex space-x-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
                      {comment.author.nickname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-sm">{comment.author.nickname}</p>
                      <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      <Button variant="ghost" size="sm" className="text-xs text-gray-500 h-auto p-0">
                        좋아요 {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs text-gray-500 h-auto p-0">
                        답글
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 댓글 입력 */}
        <div className="border-t pt-4">
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
                나
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex space-x-2">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="min-h-[40px] resize-none"
                rows={1}
              />
              <Button
                onClick={handleCommentSubmit}
                disabled={!comment.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
