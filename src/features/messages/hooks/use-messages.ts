"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface SendMessageData {
  content: string
  type: "text" | "image" | "file"
  senderId: string
  receiverId?: string
  groupId?: string
}

export function useMessages(chatId: string, type: "direct" | "group") {
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.append("chatId", chatId)
      params.append("type", type)

      const response = await fetch(`/api/messages?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "메시지를 불러오는데 실패했습니다")
      }

      setMessages(result.messages)
    } catch (error) {
      setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (chatId) {
      fetchMessages()
    }
  }, [chatId, type])

  return {
    messages,
    isLoading,
    error,
    refetch: fetchMessages,
  }
}

export function useSendMessage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const sendMessage = async (data: SendMessageData) => {
    setIsLoading(true)
    try {
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
    } catch (error) {
      toast({
        title: "메시지 전송 실패",
        description: error instanceof Error ? error.message : "메시지 전송 중 오류가 발생했습니다",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    sendMessage,
    isLoading,
  }
}
