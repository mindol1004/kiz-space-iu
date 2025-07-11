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
const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password']
const LANDING_PATHS = ['/']

// 쿠키 유틸리티 함수 (서버 설정 쿠키 대응)
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null

  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift() || null
      console.log(`Cookie ${name}:`, cookieValue ? 'Found' : 'Not found')
      return cookieValue
    }
    console.log(`Cookie ${name}: Not found`)
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
    const isExpired = payload.exp && payload.exp < currentTime
    console.log('Token expiry check:', { 
      exp: payload.exp, 
      current: currentTime, 
      expired: isExpired 
    })
    return isExpired
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
  const [isInitializing, setIsInitializing] = useState(true)
  const [currentPath, setCurrentPath] = useState<string>("")
  const [authCheckAttempts, setAuthCheckAttempts] = useState(0)

  useEffect(() => {
    // 클라이언트 사이드에서만 pathname 설정
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname)
      console.log('Current path:', window.location.pathname)
    }
  }, [])

  useEffect(() => {
    const verifyAuth = async () => {
      console.log('=== Auth verification started ===')
      console.log('Current path:', currentPath)
      console.log('Require auth:', requireAuth)
      console.log('Is authenticated:', isAuthenticated)
      console.log('User:', user)

      try {
        // 현재 경로가 public 경로인 경우 인증 체크하지 않음
        if (PUBLIC_PATHS.includes(currentPath) || LANDING_PATHS.includes(currentPath)) {
          console.log('Public path detected, skipping auth check')
          setIsInitializing(false)
          return
        }

        // requireAuth가 false인 경우 인증 체크하지 않음
        if (!requireAuth) {
          console.log('Auth not required, skipping check')
          setIsInitializing(false)
          return
        }

        // 쿠키에서 JWT 토큰 확인 (서버 설정 쿠키 대응)
        const token = getCookie('accessToken')
        console.log('Access token from cookie:', token ? 'Present' : 'Missing')

        if (!token) {
          console.log('No access token, clearing auth and redirecting')
          clearAuth()
          router.push(redirectTo)
          return
        }

        // 토큰 만료 체크
        if (isTokenExpired(token)) {
          console.log('Token expired, clearing auth and redirecting')
          clearAuth()
          router.push(redirectTo)
          return
        }

        // 이미 인증된 상태이고 사용자 정보가 있다면 더 이상 체크하지 않음
        if (isAuthenticated && user) {
          console.log('Already authenticated with user data, proceeding')
          setIsInitializing(false)
          return
        }

        // 인증 상태 확인 (서버 API 호출)
        console.log('Checking auth status via API...')
        const isAuth = await checkAuthStatus()
        console.log('Auth check result:', isAuth)

        if (!isAuth) {
          console.log('Auth check failed, clearing and redirecting')
          clearAuth()
          router.push(redirectTo)
          return
        }

        console.log('Auth verification successful')
        setIsInitializing(false)
      } catch (error) {
        console.error('Auth verification failed:', error)
        clearAuth()
        router.push(redirectTo)
      }
    }

    // currentPath가 설정되고 아직 인증 체크를 완료하지 않은 경우에만 실행
    if (currentPath !== "" && isInitializing && authCheckAttempts < 3) {
      setAuthCheckAttempts(prev => prev + 1)
      verifyAuth()
    }
  }, [checkAuthStatus, router, isAuthenticated, user, currentPath, requireAuth, redirectTo, clearAuth, isInitializing, authCheckAttempts])

  // 페이지 새로고침 시 인증 상태 재확인
  useEffect(() => {
    const handlePageLoad = () => {
      console.log('Page loaded, checking auth status')
      if (currentPath && !PUBLIC_PATHS.includes(currentPath) && !LANDING_PATHS.includes(currentPath)) {
        setAuthCheckAttempts(0)
        setIsInitializing(true)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('load', handlePageLoad)
      return () => window.removeEventListener('load', handlePageLoad)
    }
  }, [currentPath])

  // 토큰 만료 체크 (주기적으로 실행)
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (typeof window !== 'undefined' && isAuthenticated) {
        const token = getCookie('accessToken')

        if (!token || isTokenExpired(token)) {
          console.log('Token expired during periodic check')
          clearAuth()
          router.push(redirectTo)
        }
      }
    }

    // 5분마다 토큰 만료 체크
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [isAuthenticated, clearAuth, router, redirectTo])

  // 초기화 중이거나 인증 체크 중인 경우
  if (isInitializing || isChecking) {
    console.log('Showing loading state:', { isInitializing, isChecking })
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
    console.log('Auth required but not authenticated')
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  console.log('Rendering protected content')
  // 인증된 사용자에게만 자식 컴포넌트 렌더링
  return <>{children}</>
}