
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useCallback } from "react"

export function useBookmarks(userIdFromProps?: string) {
  const { toast } = useToast()
  const { user } = useAuthStore()

  const currentUserId = userIdFromProps || user?.id;

  const {
    data: bookmarks,
    isLoading,
    error,
    refetch,
  } = useQuery<any[], Error>({
    queryKey: ["bookmarks", currentUserId],
    queryFn: async () => {
      if (!currentUserId) {
        throw new Error("User not authenticated.");
      }
      
      const response = await fetch(`/api/bookmarks?userId=${currentUserId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // 쿠키 포함
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch bookmarks");
      }
      
      const result = await response.json();
      return result.bookmarks || [];
    },
    enabled: !!currentUserId,
    retry: 1,
  });

  // useCallback으로 토스트 호출을 메모이제이션
  const showErrorToast = useCallback((message: string) => {
    toast({
      title: "북마크 불러오기 실패",
      description: message,
      variant: "destructive",
    });
  }, [toast]);

  // 에러 처리를 useEffect 대신 별도 함수로 분리
  if (error && !isLoading) {
    showErrorToast(error.message);
  }

  return {
    bookmarks: bookmarks || [],
    isLoading,
    error,
    refetch,
  };
}

export function useAddBookmark() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async ({ postId, category }: { postId: string; category?: string }) => {
      if (!user?.id) {
        throw new Error("로그인이 필요합니다");
      }

      const response = await fetch(`/api/bookmarks`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ postId, category }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "북마크 추가에 실패했습니다")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] })
      toast({
        title: "북마크 추가 완료",
        description: "북마크가 추가되었습니다.",
      })
    },
    onError: (error) => {
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
    mutationFn: async ({ postId }: { postId: string }) => {
      if (!user?.id) {
        throw new Error("로그인이 필요합니다");
      }

      const response = await fetch(`/api/bookmarks?postId=${postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "북마크 삭제에 실패했습니다")
      }

      return postId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", user?.id] })
      toast({
        title: "북마크 삭제 완료",
        description: "북마크가 삭제되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "북마크 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
