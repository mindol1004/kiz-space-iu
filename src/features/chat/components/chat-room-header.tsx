"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ChatRoom } from "@/features/chat/types/chat-types"

interface ChatRoomHeaderProps {
  room: ChatRoom
}

export function ChatRoomHeader({ room }: ChatRoomHeaderProps) {
  const router = useRouter()

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="h-10 w-10">
            <AvatarImage src={room.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              {room.name[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="font-semibold">{room.name}</h1>
            <p className="text-sm text-gray-500">
              {room.type === "group" ? `${room.participants}명` : room.isOnline ? "온라인" : "오프라인"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
