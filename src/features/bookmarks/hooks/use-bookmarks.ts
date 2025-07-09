"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/shared/stores/auth-store"

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
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch bookmarks");
      }
      const result = await response.json();
      return result.bookmarks; // <--- MODIFIED HERE: Access the 'bookmarks' array from the response object
    },
    enabled: !!currentUserId, // Only run the query if userId is available
  });

  if (error) {
    toast({
      title: "북마크 불러오기 실패",
      description: error.message,
      variant: "destructive",
    });
  }

  return {
    bookmarks: bookmarks || [],
    isLoading,
    error,
    refetch,
  };
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ bookmarkId, userId }: { bookmarkId: string; userId: string }) => {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "북마크 삭제에 실패했습니다")
      }

      return bookmarkId
    },
    onSuccess: (bookmarkId, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", variables.userId] })
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
