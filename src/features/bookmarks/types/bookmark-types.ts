export type BookmarkCategory = "pregnancy" | "newborn" | "education" | "health" | "tips"

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
  searchQuery: string
}
