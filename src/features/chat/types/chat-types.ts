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
  content: string
  type: "text" | "image" | "file"
  senderId: string
  sender: {
    id: string
    nickname: string
    avatar?: string
  }
  createdAt: Date
  imageUrl?: string
  fileName?: string
  fileSize?: string
}
