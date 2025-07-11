"use client"

import { CommentItem } from "./comment-item"
import { useComments } from "../hooks/use-comments"
import { Loader2 } from "lucide-react"

interface CommentListProps {
  postId: string
}

export function CommentList({ postId }: CommentListProps) {
  const { data: commentsData, isLoading } = useComments(postId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
      </div>
    )
  }

  if (!commentsData) {
    return null
  }

  const { comments } = commentsData

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          댓글 {comments.length}개
        </h3>
      </div>

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