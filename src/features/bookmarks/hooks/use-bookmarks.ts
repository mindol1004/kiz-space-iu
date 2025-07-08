"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

export function useBookmarks(userId: string) {
  return useQuery({
    queryKey: ["bookmarks", userId],
    queryFn: async () => {
      const response = await fetch(`/api/bookmarks?userId=${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "북마크를 불러오는데 실패했습니다")
      }

      return result.bookmarks
    },
    enabled: !!userId,
  })
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
