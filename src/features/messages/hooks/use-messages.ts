"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface SendMessageData {
  content: string
  type: "text" | "image" | "file"
  senderId: string
  receiverId?: string
  groupId?: string
}

export function useMessages(chatId: string, type: "direct" | "group") {
  return useQuery({
    queryKey: ["messages", chatId, type],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.append("chatId", chatId)
      params.append("type", type)

      const response = await fetch(`/api/messages?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "메시지를 불러오는데 실패했습니다")
      }

      return result.messages
    },
    enabled: !!chatId,
    refetchInterval: 3000, // 3초마다 새로고침
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: SendMessageData) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "메시지 전송에 실패했습니다")
      }

      return result.message
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] })
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] })
    },
    onError: (error) => {
      toast({
        title: "메시지 전송 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
