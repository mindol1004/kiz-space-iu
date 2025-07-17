"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/shared/stores/auth-store"
import { BookmarkAPI, type CreateBookmarkData } from "../api/bookmark-api"
import { useEffect } from "react"

export function useBookmarks(userIdFromProps?: string) {
  const { toast } = useToast()
  const { user } = useAuthStore()

  const currentUserId = userIdFromProps || user?.id

  const {
    data: bookmarksData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookmarks", currentUserId],
    queryFn: () => BookmarkAPI.getBookmarks({}),
    enabled: !!currentUserId,
    retry: 1,
  })

  // 에러 처리를 useEffect로 분리하여 무한 렌더링 방지
  useEffect(() => {
    if (error && !isLoading) {
      toast({
        title: "북마크 불러오기 실패",
        description: error.message,
        variant: "destructive",
      })
    }
  }, [error, isLoading, toast])

  return {
    bookmarks: bookmarksData?.bookmarks || [],
    isLoading,
    error,
    refetch,
  }
}

export function useAddBookmark() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: (data: CreateBookmarkData) => BookmarkAPI.addBookmark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] })
      toast({
        title: "북마크 추가 완료",
        description: "북마크가 추가되었습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "북마크 추가 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => BookmarkAPI.removeBookmark(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] })
      toast({
        title: "북마크 삭제 완료",
        description: "북마크가 삭제되었습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "북마크 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useToggleBookmark() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => BookmarkAPI.toggleBookmark(postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })

      toast({
        title: data.isBookmarked ? "북마크 추가" : "북마크 제거",
        description: data.isBookmarked 
          ? "북마크가 추가되었습니다." 
          : "북마크가 제거되었습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "북마크 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}