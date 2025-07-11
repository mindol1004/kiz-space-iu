
"use client"

import type React from "react"
import { AuthGuard } from "./auth-guard"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  fallback, 
  requireAuth = true 
}: ProtectedRouteProps) {
  // 인증이 필요하지 않은 페이지는 바로 렌더링
  if (!requireAuth) {
    return <>{children}</>
  }

  // 인증이 필요한 페이지는 AuthGuard로 보호
  return (
    <AuthGuard fallback={fallback}>
      {children}
    </AuthGuard>
  )
}
