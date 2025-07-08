"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "mention" | "group_invite"
  title: string
  message: string
  isRead: boolean
  createdAt: string
  data?: any
}

export function useNotifications(userId: string) {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async (): Promise<Notification[]> => {
      const response = await fetch(`/api/notifications?userId=${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "알림을 불러오는데 실패했습니다")
      }

      return result.notifications
    },
    enabled: !!userId,
  })
}

export function useUnreadNotificationCount(userId: string) {
  return useQuery({
    queryKey: ["unreadNotifications", userId],
    queryFn: async (): Promise<number> => {
      const response = await fetch(`/api/notifications/unread?userId=${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "읽지 않은 알림 수를 불러오는데 실패했습니다")
      }

      return result.count
    },
    enabled: !!userId,
    refetchInterval: 30000, // 30초마다 새로고침
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (notificationId: string): Promise<void> => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "알림 읽음 처리에 실패했습니다")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] })
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

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      const response = await fetch(`/api/notifications/read-all`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "모든 알림 읽음 처리에 실패했습니다")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] })
      toast({
        title: "완료",
        description: "모든 알림을 읽음 처리했습니다.",
      })
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
