export type BookmarkCategory = "PLAY" | "HEALTH" | "EDUCATION" | "FOOD" | "PRODUCTS" | "ADVICE" | "PREGNANCY" | "NEWBORN" | "LIFESTYLE"
export type BookmarkAgeGroup = "PREGNANCY" | "NEWBORN_0_6M" | "INFANT_6_12M" | "TODDLER_1_3Y" | "PRESCHOOL_3_5Y" | "SCHOOL_5_8Y" | "TWEEN_8_12Y"

export interface BookmarkAuthor {
  id: string
  name: string
  avatar: string
}

export interface BookmarkItem {
  id: string
  title: string
  content: string
  image?: string
  category: BookmarkCategory
  author: BookmarkAuthor
  likes: number
  comments: number
  isLiked: boolean
  bookmarkedAt: string
  originalPostId: string
}

export interface BookmarkFilters {
  category: BookmarkCategory | "all"
  ageGroup: BookmarkAgeGroup | "all"
  searchQuery: string
}
