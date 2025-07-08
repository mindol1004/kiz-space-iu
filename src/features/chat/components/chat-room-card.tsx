"use client"

import { Clock, ChevronRight, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ChatRoom } from "../types/chat-types"

interface ChatRoomCardProps {
  chat: ChatRoom
}

export function ChatRoomCard({ chat }: ChatRoomCardProps) {
  const formatTime = (timeStr: string) => {
    return timeStr
  }

  return (
    <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
              <AvatarFallback className="bg-pink-100 text-pink-600">
                {chat.type === "group" ? <Users className="h-5 w-5" /> : chat.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {chat.type === "direct" && chat.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          {/* Chat Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                {chat.type === "group" && (
                  <Badge variant="secondary" className="text-xs">
                    {chat.participants}명
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(chat.lastMessageTime)}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 truncate flex-1">{chat.lastMessage}</p>
              {chat.unreadCount > 0 && (
                <Badge className="bg-pink-500 hover:bg-pink-600 text-white text-xs ml-2">
                  {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
