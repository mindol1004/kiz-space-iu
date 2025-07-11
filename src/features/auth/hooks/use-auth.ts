import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"
import { AuthAPI } from "../api/auth-api"
import { LoginRequest, RegisterRequest } from "../types/auth-api-types"
import { toast } from "sonner"

export function useLogin() {
  const { login } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthAPI.login(data),
    onSuccess: (data) => {
      // 사용자 정보와 인증 상태를 즉시 설정
      login(data.user)

      toast.success("로그인 성공! 환영합니다!")

      // 상태가 확실히 저장된 후 리다이렉트
      setTimeout(() => {
        router.push('/feed')
      }, 100)
    },
    onError: (error: Error) => {
      console.error("로그인 실패:", error)
      toast.error(`로그인 실패: ${error.message}`)
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      // 로그아웃 API 호출 전에 먼저 로컬 상태 초기화
      logout()
      queryClient.clear()
      return AuthAPI.logout()
    },
    onSuccess: () => {
      toast.success("안전하게 로그아웃되었습니다.")
      router.push("/login")
    },
    onError: (error: Error) => {
      // 이미 로컬 상태는 초기화되었으므로 토스트만 표시
      toast.success("로그아웃되었습니다.")
      router.push("/login")
    },
  })
}

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthAPI.register(data),
    onSuccess: () => {
      toast.success("회원가입 성공! 로그인 페이지로 이동합니다.")
      router.push("/login")
    },
    onError: (error: Error) => {
      console.error("회원가입 실패:", error)
      toast.error(`회원가입 실패: ${error.message}`)
    },
  })
}
