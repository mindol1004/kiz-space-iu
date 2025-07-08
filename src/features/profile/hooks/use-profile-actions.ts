"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"

export function useProfileActions() {
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleSettings = useCallback(() => {
    // 설정 페이지로 이동
    console.log("설정 페이지로 이동")
  }, [])

  const handleSchedule = useCallback(() => {
    // 일정 관리 페이지로 이동
    console.log("일정 관리 페이지로 이동")
  }, [])

  const handleLogout = useCallback(() => {
    logout()
    router.push("/")
  }, [logout, router])

  return {
    handleSettings,
    handleSchedule,
    handleLogout,
  }
}
