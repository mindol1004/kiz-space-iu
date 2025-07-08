"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTime } from "@/lib/utils"
import type { Message } from "@/features/chat/types/chat-types"

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showAvatar: boolean
}

export function MessageBubble({ message, isOwn, showAvatar }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}
    >
      <div className={`flex ${isOwn ? "flex-row-reverse" : "flex-row"} items-end space-x-2 max-w-[80%]`}>
        {!isOwn && (
          <div className="w-8 h-8 flex-shrink-0">
            {showAvatar ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.sender.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
                  {message.sender.name[0]}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-8 h-8" />
            )}
          </div>
        )}

        <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
          {!isOwn && showAvatar && <p className="text-xs text-gray-500 mb-1 px-2">{message.sender.name}</p>}

          <div
            className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
              isOwn
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                : "bg-white border border-gray-200 text-gray-900"
            }`}
          >
            {message.type === "text" && <p className="text-sm">{message.content}</p>}

            {message.type === "image" && (
              <div className="space-y-2">
                <img
                  src={message.content || "/placeholder.svg"}
                  alt="Shared image"
                  className="rounded-lg max-w-full h-auto"
                />
                {message.text && <p className="text-sm">{message.text}</p>}
              </div>
            )}

            {message.type === "file" && (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded">📎</div>
                <div>
                  <p className="text-sm font-medium">{message.fileName}</p>
                  <p className="text-xs opacity-75">{message.fileSize}</p>
                </div>
              </div>
            )}
          </div>

          <p className={`text-xs text-gray-400 mt-1 px-2 ${isOwn ? "text-right" : "text-left"}`}>
            {formatTime(new Date(message.createdAt))}
            {isOwn && message.isRead && <span className="ml-1 text-pink-500">읽음</span>}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
