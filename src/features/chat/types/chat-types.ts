export interface ChatRoom {
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

export interface Message {
  id: string
  chatRoomId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  type: "text" | "image" | "file"
  isRead: boolean
}

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen?: string
}
