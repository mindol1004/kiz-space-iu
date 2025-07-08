"use client"

import { motion } from "framer-motion"
import { MessageCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatEmptyStateProps {
  searchQuery: string
}

export function ChatEmptyState({ searchQuery }: ChatEmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
      <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {searchQuery ? "검색 결과가 없어요" : "아직 채팅이 없어요"}
      </h3>
      <p className="text-gray-500 mb-6">{searchQuery ? "다른 검색어로 시도해보세요" : "새로운 채팅을 시작해보세요"}</p>
      <Button className="bg-pink-500 hover:bg-pink-600">
        <Plus className="h-4 w-4 mr-2" />새 채팅 시작하기
      </Button>
    </motion.div>
  )
}
