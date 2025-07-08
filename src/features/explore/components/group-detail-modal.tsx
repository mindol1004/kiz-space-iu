"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, Heart, MessageCircle } from "lucide-react"
import type { PopularGroup } from "@/features/explore/types/explore-types"

interface GroupDetailModalProps {
  group: PopularGroup
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GroupDetailModal({ group, open, onOpenChange }: GroupDetailModalProps) {
  const [isJoined, setIsJoined] = useState(false)
  const [memberCount, setMemberCount] = useState(group.memberCount)

  const handleJoinGroup = () => {
    setIsJoined(!isJoined)
    setMemberCount((prev) => (isJoined ? prev - 1 : prev + 1))
  }

  const recentPosts = [
    {
      id: "1",
      title: "신생아 수면 패턴 질문드려요",
      author: "김엄마",
      time: "2시간 전",
      likes: 12,
      comments: 8,
    },
    {
      id: "2",
      title: "이유식 시작 시기에 대해서",
      author: "이엄마",
      time: "4시간 전",
      likes: 8,
      comments: 5,
    },
    {
      id: "3",
      title: "육아용품 추천 부탁드려요",
      author: "박엄마",
      time: "6시간 전",
      likes: 15,
      comments: 12,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>그룹 정보</DialogTitle>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 그룹 헤더 */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-white">{group.name[0]}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{group.name}</h2>
              <p className="text-gray-600 mt-2">{group.description}</p>
            </div>
          </div>

          {/* 그룹 정보 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-600">
              <Users className="h-5 w-5" />
              <span>멤버 {memberCount.toLocaleString()}명</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Badge variant="secondary">{group.category}</Badge>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>전국</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>2023년 3월 생성</span>
            </div>
          </div>

          {/* 가입 버튼 */}
          <Button
            onClick={handleJoinGroup}
            className={`w-full ${
              isJoined
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            }`}
          >
            {isJoined ? "그룹 나가기" : "그룹 가입하기"}
          </Button>

          {/* 최근 게시글 */}
          <div className="space-y-4">
            <h3 className="font-semibold">최근 게시글</h3>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer"
                >
                  <h4 className="font-medium text-sm">{post.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 그룹 규칙 */}
          <div className="space-y-3">
            <h3 className="font-semibold">그룹 규칙</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 서로 존중하며 예의를 지켜주세요</p>
              <p>• 육아와 관련된 내용만 공유해주세요</p>
              <p>• 광고성 게시글은 금지됩니다</p>
              <p>• 개인정보 공유를 주의해주세요</p>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
