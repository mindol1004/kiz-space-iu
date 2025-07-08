"use client"

import { useState, useEffect } from "react"

export function useBookmarks(userId: string) {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookmarks = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/bookmarks?userId=${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "북마크를 불러오는데 실패했습니다")
      }

      setBookmarks(result.bookmarks)
    } catch (error) {
      setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchBookmarks()
    }
  }, [userId])

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

  return {
    bookmarks,
    isLoading,
    error,
    removeBookmark,
    toggleLike,
    refetch: fetchBookmarks,
  }
}
