"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"
import type { Message } from "@/features/chat/types/chat-types"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOwn = message.senderId === "current-user" // 실제로는 현재 사용자 ID와 비교

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex ${isOwn ? "flex-row-reverse" : "flex-row"} items-end space-x-2 max-w-xs lg:max-w-md`}>
        {!isOwn && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
              {message.sender.nickname[0]}
            </AvatarFallback>
          </Avatar>
        )}

        <div className={`${isOwn ? "mr-2" : "ml-2"}`}>
          {!isOwn && <p className="text-xs text-gray-500 mb-1">{message.sender.nickname}</p>}

          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "bg-white border border-gray-200 text-gray-900"
            }`}
          >
            {message.type === "text" && <p className="text-sm">{message.content}</p>}

            {message.type === "image" && (
              <div className="space-y-2">
                {message.content && <p className="text-sm">{message.content}</p>}
                <img
                  src={message.imageUrl || "/placeholder.svg"}
                  alt="Shared image"
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            )}

            {message.type === "file" && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">📄</div>
                <div>
                  <p className="text-sm font-medium">{message.fileName}</p>
                  <p className="text-xs opacity-75">{message.fileSize}</p>
                </div>
              </div>
            )}
          </div>

          <p className={`text-xs text-gray-500 mt-1 ${isOwn ? "text-right" : "text-left"}`}>
            {formatDate(message.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
