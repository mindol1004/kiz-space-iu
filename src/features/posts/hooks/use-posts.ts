"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { DEFAULT_PAGE_SIZE, MESSAGES } from "@/shared/constants/common-data"

interface Post {
  _id: string
  content: string
  images: string[]
  category: string
  ageGroup: string
  tags: string[]
  authorId: string
  author: {
    id: string
    nickname: string
    avatar: string
  }
  likesCount: number
  commentCount: number
  bookmarksCount: number
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

export function usePosts(category?: string, ageGroup?: string, page = 1) {
  return useQuery({
    queryKey: ["posts", category, ageGroup, page],
    queryFn: async (): Promise<PostsResponse> => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: DEFAULT_PAGE_SIZE.toString(),
      })

      if (category && category !== "all") {
        params.append("category", category)
      }
      if (ageGroup && ageGroup !== "all") {
        params.append("ageGroup", ageGroup)
      }

      const response = await fetch(`/api/posts?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      return response.json()
    },
  })
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

export function useLikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to like post")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}

export function useBookmarkPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: "POST",
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