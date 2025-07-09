"use client"

import { motion } from "framer-motion"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { ProfileUser } from "../types/profile-types"

interface ProfileHeaderProps {
  user: ProfileUser
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
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
        {user.location} • 가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}
      </p>
      <div className="flex justify-center mt-2">
        <Badge className={user.verified ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gray-400"}>
          {user.verified ? "인증 회원" : "일반 회원"}
        </Badge>
      </div>
    </motion.div>
  )
}
