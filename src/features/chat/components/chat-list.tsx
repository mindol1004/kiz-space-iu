"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatRoomCard } from "./chat-room-card"
import { ChatQuickActions } from "./chat-quick-actions"
import { ChatEmptyState } from "./chat-empty-state"
import { MOCK_CHAT_ROOMS } from "@/shared/constants/common-data"

export function ChatList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredChats = MOCK_CHAT_ROOMS.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "groups") return matchesSearch && chat.type === "group"
    if (activeTab === "direct") return matchesSearch && chat.type === "direct"

    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">채팅</h1>
            <p className="text-sm text-gray-500">육아 친구들과 소통해요</p>
          </div>
          <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
            <Plus className="h-4 w-4 mr-1" />새 채팅
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="채팅방 또는 메시지 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="all" className="text-sm">
              전체
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-sm">
              그룹채팅
            </TabsTrigger>
            <TabsTrigger value="direct" className="text-sm">
              개인채팅
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Chat List */}
        <div className="space-y-2">
          {filteredChats.map((chat, index) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChatRoomCard chat={chat} />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredChats.length === 0 && <ChatEmptyState searchQuery={searchQuery} />}

        {/* Quick Actions */}
        <ChatQuickActions />
      </div>
    </div>
  )
}
