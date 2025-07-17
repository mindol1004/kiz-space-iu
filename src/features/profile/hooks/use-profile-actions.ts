"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useToast } from "@/hooks/use-toast"

export function useProfileActions() {
  const router = useRouter()
  const { logout: authLogout } = useAuthStore()
  const { toast } = useToast()

  const navigateToSettings = () => {
    // 설정 페이지로 이동하는 로직
    toast({
      title: "설정",
      description: "설정 기능은 준비 중입니다.",
    })
  }

  const navigateToSchedule = () => {
    // 일정 관리 페이지로 이동하는 로직
    toast({
      title: "일정 관리",
      description: "일정 관리 기능은 준비 중입니다.",
    })
  }

  const logout = async () => {
    try {
      await authLogout()
      router.push('/login')
      toast({
        title: "로그아웃 완료",
        description: "성공적으로 로그아웃되었습니다.",
      })
    } catch (error) {
      toast({
        title: "로그아웃 실패",
        description: "로그아웃 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  return {
    navigateToSettings,
    navigateToSchedule,
    logout,
  }
}