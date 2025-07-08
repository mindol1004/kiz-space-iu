"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface PostFilters {
  category?: string
  ageGroup?: string
  page?: number
  limit?: number
}

interface CreatePostData {
  content: string
  images?: string[]
  category: string
  ageGroup: string
  tags: string[]
  authorId: string
}

export function usePosts(filters: PostFilters = {}) {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filters.category) params.append("category", filters.category)
      if (filters.ageGroup) params.append("ageGroup", filters.ageGroup)
      if (filters.page) params.append("page", filters.page.toString())
      if (filters.limit) params.append("limit", filters.limit.toString())

      const response = await fetch(`/api/posts?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "게시글을 불러오는데 실패했습니다")
      }

      setPosts(result.posts)
      setHasMore(result.hasMore)
    } catch (error) {
      setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [filters.category, filters.ageGroup, filters.page])

  return {
    posts,
    isLoading,
    hasMore,
    error,
    refetch: fetchPosts,
  }
}

export function useCreatePost() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const createPost = async (data: CreatePostData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "게시글 작성에 실패했습니다")
      }

      toast({
        title: "게시글 작성 완료",
        description: "새 게시글이 성공적으로 작성되었습니다.",
      })

      return result.post
    } catch (error) {
      toast({
        title: "게시글 작성 실패",
        description: error instanceof Error ? error.message : "게시글 작성 중 오류가 발생했습니다",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createPost,
    isLoading,
  }
}

export function usePostDetail(postId: string) {
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/posts/${postId}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "게시글을 불러오는데 실패했습니다")
        }

        setPost(result.post)
      } catch (error) {
        setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다")
      } finally {
        setIsLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId])

  return {
    post,
    isLoading,
    error,
  }
}

export function useLikePost() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const toggleLike = async (postId: string, userId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "좋아요 처리에 실패했습니다")
      }

      return result.isLiked
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "좋아요 처리 중 오류가 발생했습니다",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    toggleLike,
    isLoading,
  }
}

export function useBookmarkPost() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const toggleBookmark = async (postId: string, userId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "북마크 처리에 실패했습니다")
      }

      return result.isBookmarked
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "북마크 처리 중 오류가 발생했습니다",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    toggleBookmark,
    isLoading,
  }
}
