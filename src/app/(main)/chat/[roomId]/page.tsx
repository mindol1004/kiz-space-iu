"use client"

import { useRef, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useChatRoom } from "@/features/chat/hooks/use-chat-room"
import { MessageBubble } from "@/features/chat/components/message-bubble"
import { ChatRoomHeader } from "@/features/chat/components/chat-room-header"
import { MessageInput } from "@/features/chat/components/message-input"

export default function ChatRoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { room, messages, sendMessage, isLoading } = useChatRoom(roomId)
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">채팅방을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">채팅방을 찾을 수 없습니다.</p>
          <Button onClick={() => router.back()} className="mt-4">
            돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatRoomHeader room={room} onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === "current-user-id"}
              showAvatar={index === 0 || messages[index - 1].senderId !== message.senderId}
            />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={sendMessage} />
    </div>
  )
}
