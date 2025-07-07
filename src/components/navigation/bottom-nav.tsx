"use client"

import { motion } from "framer-motion"
import { Home, Search, MessageCircle, Bookmark, User } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "홈" },
    { href: "/explore", icon: Search, label: "탐색" },
    { href: "/chat", icon: MessageCircle, label: "채팅" },
    { href: "/bookmarks", icon: Bookmark, label: "북마크" },
    { href: "/profile", icon: User, label: "프로필" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href} className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center p-2 rounded-lg ${isActive ? "text-pink-500" : "text-gray-500"}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-500 rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
