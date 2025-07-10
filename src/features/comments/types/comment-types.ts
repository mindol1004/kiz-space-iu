export interface CommentAuthor {
  id: string
  nickname: string
  avatar?: string
}

export interface Comment {
  id: string
  content: string
  author: CommentAuthor
  createdAt: string
  updatedAt?: string
  postId: string
  parentId?: string
  replies?: Comment[]
  likesCount: number
  repliesCount: number
  isLiked?: boolean
}

export interface CreateCommentData {
  content: string
  postId: string
  parentId?: string
}

export interface UpdateCommentData {
  content: string
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
  page?: number
  limit?: number
  hasMore?: boolean
}

export interface CommentLikeResponse {
  liked: boolean
  likesCount: number
}

export interface UseCommentsParams {
  postId: string
  page?: number
  limit?: number
}
