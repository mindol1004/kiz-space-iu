
'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, User } from "lucide-react"

interface ChatQuickActionsProps {
  onNewDirectChat: () => void;
  onNewGroupChat: () => void;
}

export function ChatQuickActions({ onNewDirectChat, onNewGroupChat }: ChatQuickActionsProps) {
  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold mb-3">빠른 시작</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="flex-col h-16" onClick={onNewDirectChat}>
            <User className="h-5 w-5 mb-1 text-blue-500" />
            <span className="text-xs">1:1 채팅</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-col h-16" onClick={onNewGroupChat}>
            <Users className="h-5 w-5 mb-1 text-green-500" />
            <span className="text-xs">그룹 채팅</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
