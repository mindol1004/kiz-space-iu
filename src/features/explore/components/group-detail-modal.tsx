"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, Heart, MessageCircle, X } from "lucide-react"
import type { PopularGroup } from "@/features/explore/types/explore-types"
import { toast } from "sonner"

interface GroupDetailModalProps {
  group: PopularGroup
  open: boolean
  onOpenChange: (open: boolean) => void
}

async function joinOrLeaveGroup(params: { groupId: string; isJoined: boolean }) {
  const { groupId, isJoined } = params
  const method = isJoined ? "DELETE" : "POST"

  const response = await fetch(`/api/groups/${groupId}/join`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "An error occurred.")
  }

  return response.json()
}

export function GroupDetailModal({ group, open, onOpenChange }: GroupDetailModalProps) {
  const queryClient = useQueryClient()
  const [isJoined, setIsJoined] = useState(group.isJoined)
  const [memberCount, setMemberCount] = useState(group.memberCount)

  useEffect(() => {
    setIsJoined(group.isJoined)
    setMemberCount(group.memberCount)
  }, [group])

  const { mutate, isPending } = useMutation({
    mutationFn: joinOrLeaveGroup,
    onSuccess: (data) => {
      const newIsJoined = !isJoined
      setIsJoined(newIsJoined)
      setMemberCount((prev) => (newIsJoined ? prev + 1 : prev - 1))
      toast.success(data.message)
      // Invalidate and refetch popular groups to update the UI across the app
      queryClient.invalidateQueries({ queryKey: ["popularGroups"] })
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`)
    },
  })

  const handleJoinClick = () => {
    mutate({ groupId: group.id, isJoined })
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
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>그룹 정보</DialogTitle>
        </DialogHeader>
        <button onClick={() => onOpenChange(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X className="h-5 w-5" />
        </button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-white">{group.name[0]}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{group.name}</h2>
              <p className="text-gray-600 mt-2">{group.description}</p>
            </div>
          </div>

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

          <Button
            onClick={handleJoinClick}
            disabled={isPending}
            className={`w-full transition-colors ${
              isJoined
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            }`}
          >
            {isPending ? "처리중..." : isJoined ? "그룹 나가기" : "그룹 가입하기"}
          </Button>

          <div className="space-y-4">
            <h3 className="font-semibold">최근 게시글</h3>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer"
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
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
