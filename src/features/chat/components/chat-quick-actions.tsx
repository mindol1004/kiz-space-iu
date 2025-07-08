"use client"

import { Users, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ChatQuickActions() {
  return (
    <div className="mt-8 mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">빠른 액션</h3>
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-pink-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">그룹 채팅</p>
            <p className="text-xs text-gray-500">새 그룹 만들기</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">개인 채팅</p>
            <p className="text-xs text-gray-500">친구와 대화하기</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
