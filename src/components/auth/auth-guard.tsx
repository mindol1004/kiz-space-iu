"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"

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
      console.log('=== Auth verification started ===')
      console.log('Current path:', currentPath)
      console.log('Require auth:', requireAuth)
      console.log('Is authenticated:', isAuthenticated)

      // 현재 경로가 public 경로인 경우 인증 체크하지 않음
      if (PUBLIC_PATHS.includes(currentPath)) {
        console.log('Public path detected, skipping auth check')
        setIsLoading(false)
        return
      }

      // requireAuth가 false인 경우 인증 체크하지 않음
      if (!requireAuth) {
        console.log('Auth not required, skipping check')
        setIsLoading(false)
        return
      }

      // 쿠키에서 JWT 토큰 확인
      const token = getCookie('accessToken')
      console.log('Access token from cookie:', token ? 'Present' : 'Missing')

      if (!token) {
        console.log('No access token found')
        clearAuth()
        setIsLoading(false)
        router.push(redirectTo)
        return
      }

      // 토큰 만료 체크
      if (isTokenExpired(token)) {
        console.log('Token expired')
        clearAuth()
        setIsLoading(false)
        router.push(redirectTo)
        return
      }

      // 이미 인증된 상태이고 사용자 정보가 있다면 추가 체크 안함
      if (isAuthenticated && user) {
        console.log('Already authenticated with user data')
        setIsLoading(false)
        return
      }

      // 서버에서 인증 상태 확인
      try {
        console.log('Checking auth status via API...')
        const isAuth = await checkAuthStatus()

        if (isAuth) {
          console.log('Auth verification successful')
        } else {
          console.log('Auth check failed')
          router.push(redirectTo)
        }
      } catch (error) {
        console.error('Auth verification failed:', error)
        clearAuth()
        router.push(redirectTo)
      } finally {
        setIsLoading(false)
      }
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