"use client"

import { useState, useEffect } from "react"
import type { ChatRoom, Message } from "@/features/chat/types/chat-types"

export function useChatRoom(roomId: string) {
  const [room, setRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock data - 실제로는 API 호출
    const mockRoom: ChatRoom = {
      id: roomId,
      name: "신생아 케어 모임",
      type: "group",
      avatar: "/placeholder.svg",
      lastMessage: "안녕하세요! 처음 인사드립니다.",
      lastMessageTime: new Date(),
      unreadCount: 0,
      participantCount: 24,
      isOnline: true,
      participants: [],
    }

    const mockMessages: Message[] = [
      {
        id: "1",
        content: "안녕하세요! 처음 인사드립니다.",
        type: "text",
        senderId: "user1",
        sender: {
          id: "user1",
          name: "김엄마",
          avatar: "/placeholder.svg",
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        isRead: true,
      },
      {
        id: "2",
        content: "반갑습니다! 저도 신생아 엄마예요 ㅎㅎ",
        type: "text",
        senderId: "user2",
        sender: {
          id: "user2",
          name: "이엄마",
          avatar: "/placeholder.svg",
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 25),
        isRead: true,
      },
      {
        id: "3",
        content: "혹시 신생아 수면 패턴에 대해 궁금한 게 있어서요...",
        type: "text",
        senderId: "current-user-id",
        sender: {
          id: "current-user-id",
          name: "나",
          avatar: "/placeholder.svg",
        },
        createdAt: new Date(Date.now() - 1000 * 60 * 20),
        isRead: true,
      },
    ]

    setTimeout(() => {
      setRoom(mockRoom)
      setMessages(mockMessages)
      setIsLoading(false)
    }, 1000)
  }, [roomId])

  const sendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      type: "text",
      senderId: "current-user-id",
      sender: {
        id: "current-user-id",
        name: "나",
        avatar: "/placeholder.svg",
      },
      createdAt: new Date(),
      isRead: false,
    }

    setMessages((prev) => [...prev, newMessage])
  }

  return {
    room,
    messages,
    sendMessage,
    isLoading,
  }
}
