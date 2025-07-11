
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
  parentId?: string | null
  replies?: Comment[]
  likesCount: number
  repliesCount: number
  isLiked?: boolean
}

export interface CreateCommentData {
  content: string
  postId: string
  parentId?: string | null
  authorId?: string
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
  nextPage?: number
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

export interface CreateReplyData {
  parentId: string
  content: string
  postId: string
}

// API Response 타입들
export interface CommentApiResponse {
  success: boolean
  comment: Comment
}

export interface CommentsApiResponse {
  success: boolean
  comments: Comment[]
  total: number
  hasMore: boolean
  nextPage?: number
}

export interface CommentLikeApiResponse {
  success: boolean
  isLiked: boolean
  likesCount: number
}

export interface CommentDeleteApiResponse {
  success: boolean
  message: string
}
