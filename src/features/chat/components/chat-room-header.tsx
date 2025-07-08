"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ChatRoom } from "@/features/chat/types/chat-types"

interface ChatRoomHeaderProps {
  room: ChatRoom
  onBack: () => void
}

export function ChatRoomHeader({ room, onBack }: ChatRoomHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="h-10 w-10">
            <AvatarImage src={room.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              {room.name[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-semibold">{room.name}</h1>
              {room.type === "group" && (
                <Badge variant="secondary" className="text-xs">
                  {room.participantCount}명
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {room.type === "group" ? `${room.participantCount}명 참여 중` : room.isOnline ? "온라인" : "오프라인"}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>채팅방 정보</DropdownMenuItem>
              <DropdownMenuItem>알림 설정</DropdownMenuItem>
              <DropdownMenuItem>파일 보기</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">채팅방 나가기</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
