"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

const PUBLIC_PATHS = new Set(['/login', '/signup', '/'])
const AUTH_PAGES = new Set(['/login', '/signup'])

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
  const {
    isAuthenticated,
    user,
    isChecking,
    checkAuthStatus,
    clearAuth,
    hasCheckedInitialAuth
  } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  // 1. Client mount check for SSR safety
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 2. Redirect authenticated users from auth pages (login, signup) to feed
  useEffect(() => {
    if (!isMounted) return

    if (isAuthenticated && AUTH_PAGES.has(pathname)) {
      router.replace('/feed')
    }
  }, [isMounted, isAuthenticated, pathname, router])

  // 3. Handle authentication for protected routes
  useEffect(() => {
    if (!isMounted) return
    if (PUBLIC_PATHS.has(pathname)) return // Skip for public paths
    if (!requireAuth) return // Skip if auth not required for this guard instance

    // If not authenticated AND initial check not done AND not currently checking
    if (!isAuthenticated && !hasCheckedInitialAuth && !isChecking) {
      console.log('AuthGuard: Initiating auth check...')
      checkAuthStatus().then(success => {
        if (!success) {
          console.log('AuthGuard: Auth check failed, redirecting to login.')
          clearAuth()
          router.replace(redirectTo)
        } else {
          console.log('AuthGuard: Auth check succeeded.')
        }
      }).catch(error => {
        console.error('AuthGuard: Auth check error during initiation:', error)
        clearAuth()
        router.replace(redirectTo)
      })
    } else if (!isAuthenticated && hasCheckedInitialAuth && !isChecking) {
      // If not authenticated, initial check *has* happened (and failed), and not currently checking.
      // This means the user is genuinely not authenticated for a protected route after the check.
      console.log('AuthGuard: Not authenticated after initial check, redirecting.')
      router.replace(redirectTo)
    }
  }, [
    isMounted,
    isAuthenticated,
    hasCheckedInitialAuth,
    isChecking,
    pathname,
    requireAuth,
    checkAuthStatus, 
    clearAuth, 
    router, 
    redirectTo,
  ])

  // Render logic based on auth status
  if (!isMounted) {
    return null // Don't render anything on server
  }

  // Show loading fallback if auth is required and initial check is not complete
  // or if currently checking authentication
  if (requireAuth && (!hasCheckedInitialAuth || isChecking)) {
    return fallback ?? <AuthLoadingFallback />
  }

  // If auth is required but user is not authenticated after check,
  // the useEffect above should have already redirected.
  // This state implies a race condition or an unhandled edge case
  // but for safety, we could ensure redirect or show fallback.
  // For now, assume the useEffect handles the redirect properly.
  if (requireAuth && !isAuthenticated && hasCheckedInitialAuth) {
    return fallback ?? <AuthLoadingFallback />
  }

  return <>{children}</>
}