"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChatRoomHeader } from "@/features/chat/components/chat-room-header"
import { MessageBubble } from "@/features/chat/components/message-bubble"
import { MessageInput } from "@/features/chat/components/message-input"
import { useChatRoom } from "@/features/chat/hooks/use-chat-room"
import { Loader2 } from "lucide-react"

interface ChatRoomPageProps {
  params: {
    roomId: string
  }
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { roomId } = params
  const { room, messages, isLoading, sendMessage } = useChatRoom(roomId)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
        <span className="ml-2 text-gray-600">채팅방을 불러오는 중...</span>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">채팅방을 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatRoomHeader room={room} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MessageBubble message={message} />
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={sendMessage} />
    </div>
  )
}
