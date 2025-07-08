"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Paperclip, Smile } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (content: string, type?: "text" | "image" | "file") => void
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-end space-x-2">
        <Button variant="ghost" size="sm">
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="min-h-[40px] max-h-32 resize-none"
            rows={1}
          />
        </div>

        <Button variant="ghost" size="sm">
          <Smile className="h-5 w-5" />
        </Button>

        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
