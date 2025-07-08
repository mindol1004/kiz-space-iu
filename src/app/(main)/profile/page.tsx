"use client"

import { motion } from "framer-motion"
import { Edit, Heart, MessageCircle, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/stores/auth-store"
import { mockChildren } from "@/lib/mock-data"
import { ProfileContent } from "@/features/profile/components/profile-content"

export default function ProfilePage() {
  const { user } = useAuthStore()

  const stats = [
    { label: "게시글", value: 24, icon: Edit },
    { label: "좋아요", value: 156, icon: Heart },
    { label: "댓글", value: 89, icon: MessageCircle },
    { label: "북마크", value: 32, icon: Bookmark },
  ]

  const userChildren = mockChildren.filter((child) => child.parentId === user?._id)

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">로그인이 필요합니다.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="relative inline-block">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={user.avatar || "/placeholder.svg?height=96&width=96"} />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl">
              {user.nickname[0]}
            </AvatarFallback>
          </Avatar>
          <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <h1 className="text-xl font-bold">{user.nickname}</h1>
        <p className="text-gray-600 text-sm">
          {user.location} • 가입일: {user.createdAt.toLocaleDateString()}
        </p>
        <div className="flex justify-center mt-2">
          <Badge className={user.verified ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gray-400"}>
            {user.verified ? "인증 회원" : "일반 회원"}
          </Badge>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <Icon className="h-5 w-5 mx-auto mb-2 text-pink-500" />
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <ProfileContent user={user} userChildren={userChildren} stats={stats} />
    </div>
  )
}
