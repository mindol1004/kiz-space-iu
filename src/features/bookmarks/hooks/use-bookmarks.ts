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
    enabled: !!currentUserId && !!user,
    retry: 1,
    staleTime: 0, // 항상 최신 데이터 가져오기
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  // 에러 처리 제거 - 컴포넌트에서 직접 처리

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
      // 모든 북마크 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      
      // 현재 사용자의 북마크 쿼리도 명시적으로 무효화
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["bookmarks", user.id] })
      }

      // 캐시된 데이터도 즉시 업데이트
      queryClient.refetchQueries({ queryKey: ["bookmarks"] })

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