
"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { ProfileAPI } from "../api/profile-api"
import type { UserPostsResponse } from "../types/profile-types"

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
    queryFn: ({ pageParam = 1 }) =>
      ProfileAPI.getUserPosts(userId!, pageParam, 10),
    getNextPageParam: (lastPage: UserPostsResponse) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
    gcTime: 1000 * 60 * 10, // 10분간 가비지 컬렉션
  })

  // 모든 페이지의 게시글을 하나의 배열로 합치기
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
