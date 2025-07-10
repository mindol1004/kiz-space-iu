
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"
import { TopNav } from "@/components/navigation/top-nav"
import { BottomNav } from "@/components/navigation/bottom-nav"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, checkAuthStatus } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true)
      const isAuth = await checkAuthStatus()
      
      if (!isAuth) {
        router.push("/login")
      }
      setIsLoading(false)
    }

    verifyAuth()
  }, [checkAuthStatus, router])

  // 로딩 중이거나 인증되지 않은 경우 로딩 상태 표시
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  )
}
