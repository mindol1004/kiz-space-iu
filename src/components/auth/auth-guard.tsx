
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, checkAuthStatus, isChecking, user } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      // 로그인/회원가입 페이지에서는 인증 체크하지 않음
      if (typeof window !== 'undefined' && 
          (window.location.pathname === '/login' || window.location.pathname === '/signup')) {
        setIsLoading(false)
        return
      }

      // 현재 페이지가 랜딩 페이지인 경우에도 인증 체크하지 않음
      if (typeof window !== 'undefined' && window.location.pathname === '/') {
        setIsLoading(false)
        return
      }

      // JWT 토큰 확인
      const hasToken = typeof window !== 'undefined' && 
        (document.cookie.includes('accessToken=') || localStorage.getItem('auth-storage'))

      if (!hasToken) {
        router.push("/login")
        return
      }

      // 이미 인증된 상태이고 사용자 정보가 있다면 API 호출하지 않음
      if (isAuthenticated && user) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const isAuth = await checkAuthStatus()
      
      if (!isAuth) {
        router.push("/login")
        return
      }
      
      setIsLoading(false)
    }

    verifyAuth()
  }, [checkAuthStatus, router, isAuthenticated, user])

  // 로딩 중이거나 인증 체크 중인 경우
  if (isLoading || isChecking || !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  // 인증된 사용자에게만 자식 컴포넌트 렌더링
  return <>{children}</>
}
