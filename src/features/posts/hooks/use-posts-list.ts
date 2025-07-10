"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { PostsAPI } from "../api/post-api"
import { UsePostsParams } from "../types/post-type"

export function usePostsList(params: UsePostsParams = {}) {
  const query = useInfiniteQuery({
    queryKey: ["posts", params],
    queryFn: ({ pageParam = 1 }) => 
      PostsAPI.getPosts({
        ...params,
        page: pageParam,
        limit: 10
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? (lastPage.nextPage || 1) : undefined
    },
    initialPageParam: 1,
  })

  return {
    ...query,
    posts: query.data?.pages.flatMap(page => page.posts) || [],
  }
}