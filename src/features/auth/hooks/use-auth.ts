import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useToast } from "@/hooks/use-toast"
import { AuthAPI } from "../api/auth-api"
import { LoginRequest, RegisterRequest } from "../types/auth-api-types"

export function useLogin() {
  const { login } = useAuthStore()
  const router = useRouter()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthAPI.login(data),
    onSuccess: (data) => {
      // 사용자 정보와 인증 상태를 즉시 설정
      login(data.user)

      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      })

      // 상태가 확실히 저장된 후 리다이렉트 (더 긴 대기 시간)
      setTimeout(() => {
        // 강제로 페이지 새로고침하여 인증 상태 확실히 반영
        window.location.href = '/feed'
      }, 200)
    },
    onError: (error: Error) => {
      console.error("로그인 실패:", error)
      toast({
        title: "로그인 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: () => {
      // 로그아웃 API 호출 전에 먼저 로컬 상태 초기화
      logout()
      queryClient.clear()
      return AuthAPI.logout()
    },
    onSuccess: () => {
      toast({
        title: "로그아웃 완료",
        description: "안전하게 로그아웃되었습니다.",
      })
      router.push("/login")
    },
    onError: (error: Error) => {
      // 이미 로컬 상태는 초기화되었으므로 토스트만 표시
      toast({
        title: "로그아웃 완료",
        description: "로그아웃되었습니다.",
      })
      router.push("/login")
    },
  })
}

export function useRegister() {
  const router = useRouter()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthAPI.register(data),
    onSuccess: () => {
      toast({
        title: "회원가입 성공",
        description: "로그인 페이지로 이동합니다.",
      })
      router.push("/login")
    },
    onError: (error: Error) => {
      console.error("회원가입 실패:", error)
      toast({
        title: "회원가입 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}