"use client"

import { type ReactNode, useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

// 인증이 필요하지 않은 public 경로들
const PUBLIC_PATHS = new Set(['/login', '/signup', '/'])
const AUTH_PAGES = new Set(['/login', '/signup'])

// 로딩 컴포넌트
const AuthLoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4" />
      <p className="text-gray-600">인증 확인 중...</p>
    </div>
  </div>
)

export function AuthGuard({
  children,
  fallback,
  redirectTo = "/login",
  requireAuth = true
}: AuthGuardProps) {
  const { isAuthenticated, user, isChecking, checkAuthStatus, clearAuth } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 인증된 사용자가 로그인/회원가입 페이지에 접근 시 리다이렉트
  const handleAuthenticatedUserOnAuthPages = useCallback(() => {
    if (AUTH_PAGES.has(pathname) && (isChecking || (isAuthenticated && user))) {
      router.replace('/feed')
      return true
    }
    return false
  }, [pathname, isChecking, isAuthenticated, user, router])

  // 보호된 라우트에 대한 인증 확인
  const handleProtectedRouteAuth = useCallback(async () => {
    if (isChecking) {
      return
    }

    if (!isAuthenticated) {
      try {
        const success = await checkAuthStatus()
        if (!success) {
          clearAuth()
          router.replace(redirectTo)
        }
      } catch (error) {
        console.error('AuthGuard: Auth check error:', error)
        clearAuth()
        router.replace(redirectTo)
      }
    }
  }, [isChecking, isAuthenticated, checkAuthStatus, clearAuth, router, redirectTo])

  // 메인 인증 로직
  useEffect(() => {
    if (!isMounted) return

    // Public 경로 처리
    if (PUBLIC_PATHS.has(pathname)) {
      if (handleAuthenticatedUserOnAuthPages()) return
      return
    }

    // 인증이 필요하지 않은 페이지
    if (!requireAuth) {
      return
    }

    // 보호된 라우트 처리
    handleProtectedRouteAuth()
  }, [
    isMounted,
    pathname,
    requireAuth,
    handleAuthenticatedUserOnAuthPages,
    handleProtectedRouteAuth
  ])

  // SSR 방지
  if (!isMounted) {
    return null
  }

  // 보호된 라우트에서 로딩 중이거나 인증되지 않은 경우
  if (requireAuth && (isChecking || !isAuthenticated)) {
    return fallback ?? <AuthLoadingFallback />
  }

  return <>{children}</>
}