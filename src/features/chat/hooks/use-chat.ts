"use client"

import { useState, useEffect } from "react"
import type { ChatRoom } from "../types/chat-types"
import { mockChatRooms } from "../data/mock-chat-data"

export function useChat() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadChatRooms = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setChatRooms(mockChatRooms)
      setLoading(false)
    }

    loadChatRooms()
  }, [])

  const markAsRead = (chatRoomId: string) => {
    setChatRooms((prev) => prev.map((room) => (room.id === chatRoomId ? { ...room, unreadCount: 0 } : room)))
  }

  const updateLastMessage = (chatRoomId: string, message: string) => {
    setChatRooms((prev) =>
      prev.map((room) =>
        room.id === chatRoomId
          ? {
              ...room,
              lastMessage: message,
              lastMessageTime: "방금 전",
              unreadCount: room.unreadCount + 1,
            }
          : room,
      ),
    )
  }

  return {
    chatRooms,
    loading,
    markAsRead,
    updateLastMessage,
  }
}
