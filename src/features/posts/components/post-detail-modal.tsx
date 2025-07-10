"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Post } from "../types/post-type"
import { getCategoryLabel, getAgeGroupLabel } from "@/shared/constants/common-data"
import { usePostDetailModal } from "../hooks/use-post-detail-modal"
import { PostActions } from "./post-actions"

interface PostDetailModalProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostDetailModal({ post, open, onOpenChange }: PostDetailModalProps) {
  const {
    comment,
    comments,
    setComment,
    handleCommentSubmit,
    incrementViews,
  } = usePostDetailModal(post)

  // 모달이 열릴 때 조회수 증가
  useEffect(() => {
    if (open) {
      incrementViews()
    }
  }, [open, incrementViews])

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
          <div className="py-3 border-t border-b">
            <PostActions 
              post={post} 
              variant="modal"
              commentsCount={comments?.comments?.length || 0}
            />
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            <h3 className="font-medium">댓글 {comments?.comments?.length || 0}개</h3>
            <AnimatePresence>
              {comments?.comments?.map((comment, index) => (
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
                      <span className="text-xs text-gray-500">{formatDate(new Date(comment.createdAt))}</span>
                      <Button variant="ghost" size="sm" className="text-xs text-gray-500 h-auto p-0">
                        좋아요 {comment.likesCount}
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