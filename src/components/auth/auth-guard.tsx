"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"
import { usePathname } from "next/navigation"
import { AuthAPI } from "@/features/auth/api/auth-api"
import { cookieUtils } from "@/lib/cookie"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

// 인증이 필요하지 않은 public 경로들
const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password', '/']

// 쿠키 유틸리티 함수
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null
  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  } catch (error) {
    console.error('Error reading cookie:', error)
    return null
  }
}

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp && payload.exp < currentTime
  } catch (error) {
    console.error('Error parsing token:', error)
    return true
  }
}

export function AuthGuard({ 
  children, 
  fallback, 
  redirectTo = "/login",
  requireAuth = true 
}: AuthGuardProps) {
  const { isAuthenticated, checkAuthStatus, isChecking, user, clearAuth } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [currentPath, setCurrentPath] = useState<string>("")

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  useEffect(() => {
    const verifyAuth = async () => {

      // 현재 경로가 public 경로인 경우 인증 체크하지 않음
      if (PUBLIC_PATHS.includes(currentPath)) {
        setIsLoading(false)
        return
      }

      // requireAuth가 false인 경우 인증 체크하지 않음
      if (!requireAuth) {
        setIsLoading(false)
        return
      }

      // 쿠키에서 JWT 토큰 확인
      const token = getCookie('accessToken')

      if (!token) {
        console.log('No access token found, clearing auth')
        clearAuth()
        setIsLoading(false)
        router.push(redirectTo)
        return
      }

      // 토큰 만료 체크
      if (isTokenExpired(token)) {
        console.log('Access token expired, clearing auth')
        clearAuth()
        setIsLoading(false)
        router.push(redirectTo)
        return
      }

      // 이미 인증된 상태이고 사용자 정보가 있다면 즉시 통과
      if (isAuthenticated && user) {
        setIsLoading(false)
        return
      }

      // 서버에서 인증 상태 확인 (이미 인증된 경우에만)
      if (!isAuthenticated || !user) {
        try {
          const isAuth = await checkAuthStatus()

          if (!isAuth) {
            router.push(redirectTo)
          }
        } catch (error) {
          clearAuth()
          router.push(redirectTo)
        }
      }

      setIsLoading(false)
    }

    if (currentPath) {
      verifyAuth()
    }
  }, [currentPath, requireAuth, redirectTo, isAuthenticated, user, checkAuthStatus, clearAuth, router])

  // 로딩 중이거나 인증 체크 중인 경우
  if (isLoading || isChecking) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  // 인증이 필요한 경우에만 인증 상태 체크
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로그인이 필요합니다...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}