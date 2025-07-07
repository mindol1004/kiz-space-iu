"use client"

import { useState, useEffect } from "react"
import { mockPosts } from "@/lib/mock-data"
import { usePostStore } from "@/stores/post-store"

interface PostFilters {
  category?: string
  ageGroup?: string
  page?: number
  limit?: number
}

export function usePosts(filters: PostFilters = {}) {
  const { selectedCategory, selectedAgeGroup } = usePostStore()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // 필터링 로직
        let filteredPosts = [...mockPosts]

        const category = filters.category || selectedCategory
        const ageGroup = filters.ageGroup || selectedAgeGroup

        if (category && category !== "all") {
          filteredPosts = filteredPosts.filter((post) => post.category === category)
        }

        if (ageGroup && ageGroup !== "all") {
          filteredPosts = filteredPosts.filter((post) => post.ageGroup === ageGroup)
        }

        // 시뮬레이션된 로딩 시간
        await new Promise((resolve) => setTimeout(resolve, 500))

        setData({
          posts: filteredPosts,
          hasMore: false,
        })
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [selectedCategory, selectedAgeGroup, filters.category, filters.ageGroup])

  return { data, isLoading, error }
}

export function useCreatePost() {
  return {
    mutateAsync: async (postData: any) => {
      // 시뮬레이션된 포스트 생성
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { success: true, postId: "new-post-id" }
    },
    isPending: false,
  }
}

export function useLikePost() {
  return {
    mutateAsync: async ({ postId, userId }: { postId: string; userId: string }) => {
      // 시뮬레이션된 좋아요 토글
      await new Promise((resolve) => setTimeout(resolve, 300))
      return { success: true, isLiked: true }
    },
    isPending: false,
  }
}

export function useBookmarkPost() {
  return {
    mutateAsync: async ({ postId, userId }: { postId: string; userId: string }) => {
      // 시뮬레이션된 북마크 토글
      await new Promise((resolve) => setTimeout(resolve, 300))
      return { success: true, isBookmarked: true }
    },
    isPending: false,
  }
}
