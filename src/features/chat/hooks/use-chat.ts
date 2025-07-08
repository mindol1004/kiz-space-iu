"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface ChatRoom {
  id: string
  name: string
  type: "direct" | "group"
  participants: any[]
  lastMessage?: any
  unreadCount: number
  createdAt: string
  updatedAt: string
}

interface CreateChatRoomData {
  name?: string
  type: "direct" | "group"
  participantIds: string[]
  creatorId: string
}

export function useChatRooms(userId: string) {
  return useQuery({
    queryKey: ["chatRooms", userId],
    queryFn: async (): Promise<ChatRoom[]> => {
      const response = await fetch(`/api/chat?userId=${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "채팅방을 불러오는데 실패했습니다")
      }

      return result.chatRooms
    },
    enabled: !!userId,
  })
}

export function useChatRoom(roomId: string) {
  return useQuery({
    queryKey: ["chatRoom", roomId],
    queryFn: async (): Promise<ChatRoom> => {
      const response = await fetch(`/api/chat/${roomId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "채팅방 정보를 불러오는데 실패했습니다")
      }

      return result.chatRoom
    },
    enabled: !!roomId,
  })
}

export function useCreateChatRoom() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: CreateChatRoomData): Promise<ChatRoom> => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "채팅방 생성에 실패했습니다")
      }

      return result.chatRoom
    },
    onSuccess: (chatRoom) => {
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] })
      toast({
        title: "채팅방 생성 완료",
        description: "새 채팅방이 생성되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "채팅방 생성 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
