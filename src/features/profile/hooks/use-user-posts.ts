
"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios-config"
import type { UserPost } from "../types/profile-types"

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
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(`/users/${userId}/posts`, {
        params: { page: pageParam, limit: 10 }
      })
      return response.data
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  })

  // 모든 페이지의 게시글을 하나의 배열로 합치기
  const posts: UserPost[] = data?.pages.flatMap(page => page.posts) || []

  return {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  }
}
