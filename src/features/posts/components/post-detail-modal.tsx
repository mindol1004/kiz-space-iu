"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef } from "react"
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
import { CommentList } from "@/features/comments/components/comment-list"

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
  } = usePostDetailModal(post, { enabled: open })

  // 조회수 증가를 한 번만 실행하도록 ref 사용
  const hasIncrementedViews = useRef(false)

  useEffect(() => {
    if (open && !hasIncrementedViews.current) {
      incrementViews()
      hasIncrementedViews.current = true
    }

    // 모달이 닫히면 다시 조회수 증가 가능하도록 초기화
    if (!open) {
      hasIncrementedViews.current = false
    }
  }, [open, incrementViews])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-hidden flex flex-col rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-left">게시글 상세</DialogTitle>
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

          {/* 댓글 섹션 */}
          <CommentList postId={post.id} />
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