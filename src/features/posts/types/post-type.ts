export type PostCategory = 
  | "PREGNANCY"
  | "NEWBORN" 
  | "HEALTH"
  | "EDUCATION"
  | "FOOD"
  | "PLAY"
  | "PRODUCTS"
  | "ADVICE"
  | "LIFESTYLE"

export type AgeGroup = 
  | "PREGNANCY"
  | "NEWBORN_0_6M"
  | "INFANT_6_12M"
  | "TODDLER_1_3Y"
  | "PRESCHOOL_3_5Y"
  | "SCHOOL_5_8Y"
  | "TWEEN_8_12Y"
  | "ALL"

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
  category: PostCategory
  ageGroup: AgeGroup
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
  category: PostCategory
  ageGroup: AgeGroup
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