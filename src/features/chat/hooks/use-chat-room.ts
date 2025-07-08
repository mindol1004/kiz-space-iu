"use client"

import { useState, useEffect } from "react"
import type { ChatRoom, Message } from "@/features/chat/types/chat-types"

export function useChatRoom(roomId: string) {
  const [room, setRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져옴
    const fetchRoomData = async () => {
      setIsLoading(true)

      // Mock data
      const mockRoom: ChatRoom = {
        id: roomId,
        name: roomId === "1" ? "신생아 케어 모임" : "김민지",
        type: roomId === "1" ? "group" : "direct",
        lastMessage: "안녕하세요!",
        lastMessageTime: "방금 전",
        unreadCount: 0,
        participants: roomId === "1" ? 24 : 2,
        avatar: "/placeholder.svg",
        isOnline: true,
      }

      const mockMessages: Message[] = [
        {
          id: "1",
          content: "안녕하세요! 신생아 케어에 대해 질문이 있어요.",
          type: "text",
          senderId: "other-user",
          sender: {
            id: "other-user",
            nickname: "김엄마",
            avatar: "/placeholder.svg",
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
          id: "2",
          content: "네, 무엇이든 물어보세요!",
          type: "text",
          senderId: "current-user",
          sender: {
            id: "current-user",
            nickname: "나",
            avatar: "/placeholder.svg",
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 25),
        },
        {
          id: "3",
          content: "아기가 밤에 자주 깨는데 어떻게 해야 할까요?",
          type: "text",
          senderId: "other-user",
          sender: {
            id: "other-user",
            nickname: "김엄마",
            avatar: "/placeholder.svg",
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 20),
        },
      ]

      setRoom(mockRoom)
      setMessages(mockMessages)
      setIsLoading(false)
    }

    fetchRoomData()
  }, [roomId])

  const sendMessage = (content: string, type: "text" | "image" | "file" = "text") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type,
      senderId: "current-user",
      sender: {
        id: "current-user",
        nickname: "나",
        avatar: "/placeholder.svg",
      },
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
  }

  return {
    room,
    messages,
    isLoading,
    sendMessage,
  }
}
