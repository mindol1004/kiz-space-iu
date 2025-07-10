"use client"

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_PAGE_SIZE, MESSAGES } from "@/shared/constants/common-data"

interface Post {
  id: string
  _id?: string
  content: string
  images: string[]
  category: "play" | "health" | "education" | "food" | "products" | "advice"
  ageGroup: "0-2" | "3-5" | "6-8" | "9-12" | "all"
  tags: string[]
  likes: string[]
  bookmarks: string[]
  authorId: string
  author: {
    id: string
    nickname: string
    avatar: string
  }
  likesCount: number
  commentsCount: number
  commentCount?: number
  bookmarksCount: number
  viewsCount?: number
  isLiked?: boolean
  isBookmarked?: boolean
  createdAt: string
  updatedAt: string
}

interface CreatePostData {
  content: string
  images?: string[]
  category: string
  ageGroup: string
  tags?: string[]
  authorId: string
}

interface PostsResponse {
  posts: Post[]
  hasMore: boolean
  nextPage?: number
  total: number
}

interface UsePostsParams {
  category?: string
  ageGroup?: string
}

export function usePosts(params: UsePostsParams = {}) {
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

export function useCreatePost() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "게시글 작성 완료",
        description: MESSAGES.POST_CREATED,
      })
    },
    onError: () => {
      toast({
        title: "게시글 작성 실패",
        description: MESSAGES.POST_FAILED,
        variant: "destructive",
      })
    },
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch post")
      }
      return response.json()
    },
  })
}

interface LikePostParams {
  postId: string
  userId: string
}

export function useLikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, userId }: LikePostParams) => {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to like post")
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      // 모든 posts 쿼리 키에 대해 데이터 업데이트 (카테고리, 연령대별 필터링된 쿼리들 포함)
      queryClient.setQueriesData({ queryKey: ["posts"] }, (oldData: any) => {
        if (!oldData) return oldData
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) => 
              post.id === variables.postId 
                ? { 
                    ...post, 
                    isLiked: data.liked,
                    likesCount: data.likesCount 
                  }
                : post
            )
          }))
        }
      })
      
      // 개별 post 쿼리도 업데이트
      queryClient.setQueryData(["post", variables.postId], (oldPost: any) => {
        if (!oldPost) return oldPost
        return {
          ...oldPost,
          isLiked: data.liked,
          likesCount: data.likesCount
        }
      })
      
      // invalidateQueries 제거 - 자동 refetch 방지
    },
  })
}

interface BookmarkPostParams {
  postId: string
  userId: string
}

export function useBookmarkPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, userId }: BookmarkPostParams) => {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to bookmark post")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}