
"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { ProfileAPI } from "../api/profile-api"

export function useUserPosts(userId?: string) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["user-posts", userId],
    queryFn: ({ pageParam = 1 }) => ProfileAPI.getUserPosts(userId!, pageParam, 10),
    enabled: !!userId,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  })

  const posts = data?.pages.flatMap(page => page.posts) || []

  return {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  }
}
