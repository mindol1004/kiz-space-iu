
"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"
import { cookieUtils } from "@/lib/cookie"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

// 인증이 필요하지 않은 public 경로들
const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password', '/']

// JWT 토큰 만료 체크
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
  const { isAuthenticated, user, checkAuthStatus, clearAuth } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // 클라이언트 사이드에서만 실행되도록 보장
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const verifyAuth = async () => {
      try {
        const currentPath = window.location.pathname
        console.log('AuthGuard: Current path:', currentPath)

        // public 경로 처리
        if (PUBLIC_PATHS.includes(currentPath)) {
          // 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근하는 경우
          if ((currentPath === '/login' || currentPath === '/signup')) {
            const token = cookieUtils.get('accessToken')
            const userInfo = cookieUtils.get('userInfo')
            
            if (token && !isTokenExpired(token) && userInfo) {
              console.log('AuthGuard: Already authenticated, redirecting to feed')
              router.replace('/feed')
              return
            }
          }
          setIsLoading(false)
          return
        }

        // 인증이 필요하지 않은 경우
        if (!requireAuth) {
          setIsLoading(false)
          return
        }

        // 인증이 필요한 페이지 처리
        const token = cookieUtils.get('accessToken')
        const userInfo = cookieUtils.get('userInfo')

        console.log('AuthGuard: Token exists:', !!token)
        console.log('AuthGuard: UserInfo exists:', !!userInfo)
        console.log('AuthGuard: Store authenticated:', isAuthenticated)
        console.log('AuthGuard: Store user:', !!user)

        // 토큰이 없거나 만료된 경우
        if (!token || isTokenExpired(token)) {
          console.log('AuthGuard: No valid token, clearing auth and redirecting')
          clearAuth()
          router.push(redirectTo)
          setIsLoading(false)
          return
        }

        // 사용자 정보가 없는 경우
        if (!userInfo) {
          console.log('AuthGuard: No user info, clearing auth and redirecting')
          clearAuth()
          router.push(redirectTo)
          setIsLoading(false)
          return
        }

        // 스토어에 인증 상태가 없는 경우 서버에서 확인
        if (!isAuthenticated || !user) {
          console.log('AuthGuard: Store not authenticated, checking with server')
          try {
            const isAuth = await checkAuthStatus()
            if (!isAuth) {
              console.log('AuthGuard: Server auth check failed, redirecting')
              router.push(redirectTo)
            } else {
              console.log('AuthGuard: Server auth check success')
            }
          } catch (error) {
            console.error('AuthGuard: Auth check error:', error)
            clearAuth()
            router.push(redirectTo)
          }
        } else {
          console.log('AuthGuard: Already authenticated in store')
        }

        setIsLoading(false)
      } catch (error) {
        console.error('AuthGuard: Verification error:', error)
        clearAuth()
        router.push(redirectTo)
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [mounted, requireAuth, redirectTo, isAuthenticated, user, checkAuthStatus, clearAuth, router])

  // SSR 방지
  if (!mounted) {
    return null
  }

  // 로딩 중인 경우
  if (isLoading) {
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
