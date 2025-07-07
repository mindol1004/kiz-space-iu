"use client"

import { motion } from "framer-motion"
import { Bell, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CreatePostDialog } from "@/features/posts/components/create-post-dialog"

export function TopNav() {
  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 z-40">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            KIZ-SPACE
          </h1>
        </motion.div>

        <div className="flex items-center space-x-2">
          <CreatePostDialog />
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">
              엄
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  )
}
