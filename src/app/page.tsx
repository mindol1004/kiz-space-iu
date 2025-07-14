"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"
import { cookieUtils } from "@/lib/cookie"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const handleRedirect = () => {
      console.log('HomePage: Handling redirect', { isAuthenticated, hasUser: !!user })

      // 쿠키에서 직접 확인
      const token = cookieUtils.get('accessToken')
      const userInfo = cookieUtils.get('userInfo')

      console.log('HomePage: Cookie check', { hasToken: !!token, hasUserInfo: !!userInfo })

      if (token && userInfo) {
        // 토큰 만료 체크
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const currentTime = Math.floor(Date.now() / 1000)
          const isExpired = payload.exp && payload.exp < currentTime

          if (!isExpired) {
            console.log('HomePage: Valid token found, redirecting to feed')
            router.replace('/feed')
            return
          }
        } catch (error) {
          console.error('HomePage: Error parsing token:', error)
        }
      }

      // 스토어 상태 확인
      if (isAuthenticated && user) {
        console.log('HomePage: Store authenticated, redirecting to feed')
        router.replace('/feed')
      } else {
        console.log('HomePage: Not authenticated, redirecting to login')
        router.replace('/login')
      }

      setIsChecking(false)
    }

    // 작은 딜레이로 상태 안정화 대기
    const timer = setTimeout(handleRedirect, 150)
    return () => clearTimeout(timer)
  }, [router, isAuthenticated, user])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">리다이렉트 중...</p>
        </div>
      </div>
    )
  }

  return null
}