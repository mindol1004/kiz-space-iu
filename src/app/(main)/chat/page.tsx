"use client"
import { ChatList } from "@/features/chat/components/chat-list"

interface ChatRoom {
  id: string
  name: string
  type: "group" | "direct"
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  participants: number
  avatar?: string
  isOnline?: boolean
}

const mockChatRooms: ChatRoom[] = [
  {
    id: "1",
    name: "신생아 케어 모임",
    type: "group",
    lastMessage: "밤중 수유 팁 공유해주세요!",
    lastMessageTime: "2분 전",
    unreadCount: 3,
    participants: 24,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "김민지",
    type: "direct",
    lastMessage: "아이 이유식 레시피 감사해요 ❤️",
    lastMessageTime: "10분 전",
    unreadCount: 1,
    participants: 2,
    avatar: "/placeholder-user.jpg",
    isOnline: true,
  },
  {
    id: "3",
    name: "유치원 준비반",
    type: "group",
    lastMessage: "입학 준비물 리스트 공유드려요",
    lastMessageTime: "1시간 전",
    unreadCount: 0,
    participants: 18,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "박서연",
    type: "direct",
    lastMessage: "놀이터에서 만나요!",
    lastMessageTime: "2시간 전",
    unreadCount: 0,
    participants: 2,
    avatar: "/placeholder-user.jpg",
    isOnline: false,
  },
  {
    id: "5",
    name: "워킹맘 소통방",
    type: "group",
    lastMessage: "육아휴직 복직 준비 어떻게 하셨나요?",
    lastMessageTime: "3시간 전",
    unreadCount: 5,
    participants: 42,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "이지은",
    type: "direct",
    lastMessage: "아이 발열 관련 조언 감사했어요",
    lastMessageTime: "어제",
    unreadCount: 0,
    participants: 2,
    avatar: "/placeholder-user.jpg",
    isOnline: true,
  },
]

export default function ChatPage() {
  return <ChatList chatRooms={mockChatRooms} />
}
