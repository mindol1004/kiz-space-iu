
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

// Category and Age Group mappings for UI
export const POST_CATEGORIES: Record<PostCategory, string> = {
  PREGNANCY: "임신",
  NEWBORN: "신생아",
  HEALTH: "건강",
  EDUCATION: "교육",
  FOOD: "음식",
  PLAY: "놀이",
  PRODUCTS: "제품",
  ADVICE: "조언",
  LIFESTYLE: "라이프스타일"
}

export const AGE_GROUPS: Record<AgeGroup, string> = {
  PREGNANCY: "임신",
  NEWBORN_0_6M: "신생아 (0-6개월)",
  INFANT_6_12M: "영아 (6-12개월)",
  TODDLER_1_3Y: "유아 (1-3세)",
  PRESCHOOL_3_5Y: "유치원 (3-5세)",
  SCHOOL_5_8Y: "초등 저학년 (5-8세)",
  TWEEN_8_12Y: "초등 고학년 (8-12세)",
  ALL: "전체"
}

// Helper functions
export const getCategoryLabel = (category: PostCategory): string => {
  return POST_CATEGORIES[category] || category
}

export const getAgeGroupLabel = (ageGroup: AgeGroup): string => {
  return AGE_GROUPS[ageGroup] || ageGroup
}
