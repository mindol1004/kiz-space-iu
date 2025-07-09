"use client"
import { ChatList } from "@/features/chat/components/chat-list"
import { MOCK_CHAT_ROOMS } from "@/shared/constants/common-data"

export default function ChatPage() {
  return <ChatList chatRooms={MOCK_CHAT_ROOMS} />
}