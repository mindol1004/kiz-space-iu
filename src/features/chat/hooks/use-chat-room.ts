"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import type { ChatRoom } from "@/features/chat/types/chat-types"

interface SendMessageData {
  content: string
  type?: "text" | "image" | "file"
  receiverId?: string
  groupId?: string
}

export function useChatRoom(roomId: string) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [currentUserId] = useState("current-user") // 실제로는 auth store에서 가져와야 함

  // 채팅방 정보 조회
  const {
    data: room,
    isLoading: isRoomLoading,
    error: roomError,
  } = useQuery({
    queryKey: ["chatRoom", roomId],
    queryFn: async (): Promise<ChatRoom> => {
      const response = await fetch(`/api/chat/rooms/${roomId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch chat room")
      }
      return response.json()
    },
    enabled: !!roomId,
  })

  // 메시지 목록 조회
  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (room?.type === "group") {
        params.append("groupId", roomId)
      } else {
        params.append("senderId", currentUserId)
        params.append("receiverId", roomId)
      }

      const response = await fetch(`/api/messages?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }
      return response.json()
    },
    enabled: !!roomId && !!room,
    refetchInterval: 3000, // 3초마다 새 메시지 확인
  })

  // 메시지 전송
  const sendMessageMutation = useMutation({
    mutationFn: async (data: SendMessageData) => {
      const payload = {
        content: data.content,
        type: data.type || "text",
        senderId: currentUserId,
        ...(room?.type === "group" ? { groupId: roomId } : { receiverId: roomId }),
      }

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to send message")
      }

      return response.json()
    },
    onSuccess: (data) => {
      // 메시지 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["messages", roomId] })

      // 채팅방 목록도 업데이트 (마지막 메시지 정보)
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] })

      toast({
        title: "메시지 전송 완료",
        description: "메시지가 성공적으로 전송되었습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "메시지 전송 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // 메시지 읽음 처리
  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/messages/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          userId: currentUserId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark messages as read")
      }

      return response.json()
    },
    onSuccess: () => {
      // 채팅방 목록의 읽지 않은 메시지 수 업데이트
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] })
    },
  })

  const sendMessage = (content: string, type: "text" | "image" | "file" = "text") => {
    if (!content.trim()) {
      toast({
        title: "메시지 입력 오류",
        description: "메시지 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    sendMessageMutation.mutate({ content, type })
  }

  const markAsRead = () => {
    markAsReadMutation.mutate()
  }

  return {
    room,
    messages: messagesData?.messages || [],
    hasMore: messagesData?.hasMore || false,
    isLoading: isRoomLoading || isMessagesLoading,
    error: roomError || messagesError,
    sendMessage,
    markAsRead,
    refetchMessages,
    isSending: sendMessageMutation.isPending,
    isMarkingAsRead: markAsReadMutation.isPending,
  }
}
