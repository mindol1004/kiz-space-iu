"use client"

import { useState, useEffect, useMemo } from "react"
import { mockBookmarks } from "../data/mock-bookmark-data"
import type { BookmarkItem, BookmarkCategory } from "../types/bookmark-types"

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadBookmarks = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setBookmarks(mockBookmarks)
      setIsLoading(false)
    }

    loadBookmarks()
  }, [])

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId))
  }

  const toggleLike = (bookmarkId: string) => {
    setBookmarks((prev) =>
      prev.map((bookmark) =>
        bookmark.id === bookmarkId
          ? {
              ...bookmark,
              isLiked: !bookmark.isLiked,
              likes: bookmark.isLiked ? bookmark.likes - 1 : bookmark.likes + 1,
            }
          : bookmark,
      ),
    )
  }

  const getBookmarksByCategory = (category: BookmarkCategory | "all") => {
    if (category === "all") return bookmarks
    return bookmarks.filter((bookmark) => bookmark.category === category)
  }

  const bookmarkStats = useMemo(() => {
    const stats = {
      total: bookmarks.length,
      pregnancy: 0,
      newborn: 0,
      education: 0,
      health: 0,
      tips: 0,
    }

    bookmarks.forEach((bookmark) => {
      stats[bookmark.category]++
    })

    return stats
  }, [bookmarks])

  return {
    bookmarks,
    isLoading,
    removeBookmark,
    toggleLike,
    getBookmarksByCategory,
    bookmarkStats,
  }
}
