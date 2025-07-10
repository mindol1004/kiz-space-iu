
"use client"

import { useState } from "react"

interface Comment {
  id: string
  content: string
  author: { nickname: string; avatar: string }
  createdAt: Date
  likes: number
}

export function usePostDetailModal(initialPost: any) {
  const [isLiked, setIsLiked] = useState(initialPost.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(initialPost.isBookmarked || false)
  const [likeCount, setLikeCount] = useState(initialPost.likesCount || 0)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([
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
      const newComment: Comment = {
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

  return {
    isLiked,
    isBookmarked,
    likeCount,
    comment,
    comments,
    setComment,
    handleLike,
    handleBookmark,
    handleCommentSubmit,
  }
}
