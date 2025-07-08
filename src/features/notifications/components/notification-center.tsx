"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Heart, MessageCircle, UserPlus, Calendar, X } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Notification {
  id: string
  type: "like" | "comment" | "follow" | "event" | "group"
  title: string
  message: string
  avatar?: string
  isRead: boolean
  createdAt: Date
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "like",
      title: "김엄마님이 좋아요를 눌렀습니다",
      message: "신생아 수면 패턴에 대한 게시글",
      avatar: "/placeholder.svg",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "2",
      type: "comment",
      title: "이엄마님이 댓글을 남겼습니다",
      message: "정말 유용한 정보네요! 감사합니다",
      avatar: "/placeholder.svg",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: "3",
      type: "follow",
      title: "박엄마님이 팔로우했습니다",
      message: "",
      avatar: "/placeholder.svg",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "4",
      type: "event",
      title: "육아 세미나 알림",
      message: "내일 오후 2시에 온라인 육아 세미나가 시작됩니다",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />
      case "event":
        return <Calendar className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">{unreadCount}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>알림</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                모두 읽음
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  notification.isRead ? "bg-white border-gray-200" : "bg-blue-50 border-blue-200"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {notification.avatar ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{notification.title[0]}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    {notification.message && <p className="text-sm text-gray-600 mt-1">{notification.message}</p>}
                    <p className="text-xs text-gray-500 mt-2">{formatDate(notification.createdAt)}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(notification.id)
                    }}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {notifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">새로운 알림이 없습니다</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
