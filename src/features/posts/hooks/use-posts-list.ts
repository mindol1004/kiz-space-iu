
"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { DEFAULT_PAGE_SIZE } from "@/shared/constants/common-data"
import { PostsResponse, UsePostsParams } from "../types/post-type"

export function usePostsList(params: UsePostsParams = {}) {
  const { category, ageGroup } = params

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useInfiniteQuery({
    queryKey: ["posts", category, ageGroup],
    queryFn: async ({ pageParam = 1 }): Promise<PostsResponse> => {
      const searchParams = new URLSearchParams({
        page: pageParam.toString(),
        limit: DEFAULT_PAGE_SIZE.toString(),
      })

      if (category && category !== "all" && typeof category === "string") {
        searchParams.append("category", category)
      }
      if (ageGroup && ageGroup !== "all" && typeof ageGroup === "string") {
        searchParams.append("ageGroup", ageGroup)
      }

      const response = await fetch(`/api/posts?${searchParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      return response.json()
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined
    },
    initialPageParam: 1,
  })

  // Flatten all pages into a single array
  const posts = data?.pages.flatMap(page => page.posts) || []
  const hasMore = hasNextPage

  return {
    posts,
    isLoading,
    error,
    hasMore,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching
  }
}
