"use client"

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import type { PostWithAuthor } from "@/lib/schemas"

interface PostFilters {
  category?: string
  ageGroup?: string
}

interface CreatePostData {
  content: string
  images?: string[]
  category: string
  ageGroup: string
  tags: string[]
  authorId: string
}

interface PostsResponse {
  posts: PostWithAuthor[]
  hasMore: boolean
  nextPage?: number
  total: number
}

export function usePosts(filters: PostFilters = {}) {
  const query = useInfiniteQuery({
    queryKey: ["posts", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams()
      params.append("page", pageParam.toString())
      params.append("limit", "10")
      if (filters.category) params.append("category", filters.category)
      if (filters.ageGroup) params.append("ageGroup", filters.ageGroup)

      const response = await fetch(`/api/posts?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "게시글을 불러오는데 실패했습니다")
      }

      return result as PostsResponse
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined
    },
    initialPageParam: 1,
  })

  // 모든 페이지의 posts를 평면화
  const posts = query.data?.pages.flatMap((page) => page.posts) || []

  return {
    ...query,
    posts,
    hasMore: query.data?.pages[query.data.pages.length - 1]?.hasMore || false,
  }
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${postId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "게시글을 불러오는데 실패했습니다")
      }

      return result.post as PostWithAuthor
    },
    enabled: !!postId,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const mutation = useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "게시글 작성에 실패했습니다")
      }

      return result.post as PostWithAuthor
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "게시글 작성 완료",
        description: "새 게시글이 성공적으로 작성되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "게시글 작성 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return {
    createPost: mutation.mutateAsync,
    isLoading: mutation.isPending,
    ...mutation,
  }
}

export function useLikePost() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "좋아요 처리에 실패했습니다")
      }

      return result
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] })
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useBookmarkPost() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: string; userId: string }) => {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "북마크 처리에 실패했습니다")
      }

      return result
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["post", variables.postId] })
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
