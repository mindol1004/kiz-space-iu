"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { NotificationCenter } from "@/features/notifications/components/notification-center"
import { SearchModal } from "@/features/search/components/search-modal"
import { useAuthStore } from "@/stores/auth-store"
import Link from "next/link"

export function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, isAuthenticated } = useAuthStore()

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              KIZ-SPACE
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>

            {isAuthenticated && (
              <>
                <NotificationCenter />
                <Link href="/profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm">
                      {user?.nickname?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}
