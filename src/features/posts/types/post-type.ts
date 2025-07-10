// Using string types instead of union types for flexibility

export interface PostAuthor {
  id: string
  nickname: string
  avatar?: string
}

export interface Post {
  id: string
  authorId: string
  author: PostAuthor
  content: string
  images: string[]
  category: string
  ageGroup: string
  tags: string[]

  // Engagement counts (denormalized from Prisma)
  likesCount: number
  commentsCount: number
  bookmarksCount: number
  viewsCount: number

  // Status
  isPublished: boolean
  isPinned: boolean

  // Timestamps
  createdAt: string
  updatedAt: string

  // User-specific data (populated based on current user)
  isLiked?: boolean
  isBookmarked?: boolean
}

export interface CreatePostData {
  content: string
  images?: string[]
  category: string
  ageGroup: string
  tags?: string[]
  authorId: string
}

export interface PostsResponse {
  posts: Post[]
  hasMore: boolean
  nextPage?: number
  total: number
}

export interface UsePostsParams {
  category?: string
  ageGroup?: string
}

export interface LikePostParams {
  postId: string
  userId: string
}

export interface BookmarkPostParams {
  postId: string
  userId: string
}