
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useComments, useCreateComment } from "../hooks/use-comments"
import { CommentItem } from "./comment-item"

interface CommentListProps {
  postId: string
}

export function CommentList({ postId }: CommentListProps) {
  const { user } = useAuthStore()
  const [comment, setComment] = useState("")
  
  const { data: commentsData, isLoading } = useComments(postId)
  const createCommentMutation = useCreateComment()

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !user?.id) return

    try {
      await createCommentMutation.mutateAsync({
        postId,
        content: comment.trim(),
      })
      setComment("")
    } catch (error) {
      console.error("댓글 작성 실패:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const comments = commentsData?.comments || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">댓글 {commentsData?.total || 0}개</h3>
      </div>

      {/* 댓글 작성 폼 */}
      {user && (
        <div className="space-y-3">
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.nickname[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 작성하세요..."
                className="min-h-[80px]"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleCommentSubmit}
              disabled={!comment.trim() || createCommentMutation.isPending}
              size="sm"
            >
              {createCommentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  작성 중...
                </>
              ) : (
                "댓글 작성"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))
        )}
      </div>
    </div>
  )
}
