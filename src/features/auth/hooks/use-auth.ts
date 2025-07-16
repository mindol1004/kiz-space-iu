
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
     
      // 상태 업데이트 후 충분한 시간을 두고 리다이렉트
      setTimeout(() => {
        // router.push 대신 router.replace 사용하여 뒤로가기 방지
        router.replace('/feed')
      }, 100)
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
    mutationFn: async () => {
      // 로그아웃 API 호출 전에 먼저 로컬 상태 초기화
      logout()
      queryClient.clear()
      
      try {
        return await AuthAPI.logout()
      } catch (error) {
        // API 호출 실패해도 로컬 상태는 이미 초기화됨
        console.warn('Logout API failed, but local state cleared:', error)
        return { success: true }
      }
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

/**
 * 전역 `useAuthStore`에서 인증 상태와 사용자 정보를 가져오는 커스텀 훅.
 * 컴포넌트에서 현재 사용자의 인증 여부와 정보를 쉽게 확인할 수 있습니다.
 * 
 * @returns {object}
 * - `user`: 현재 로그인된 사용자 객체 (User | null)
 * - `isAuthenticated`: 로그인 여부 (boolean)
 * - `isLoading`: 인증 상태 확인 중인지 여부 (boolean)
 * - `hasCheckedInitialAuth`: 초기 인증 확인 완료 여부 (boolean)
 */
export const useAuth = () => {
    const { user, isAuthenticated, isChecking, hasCheckedInitialAuth } = useAuthStore(state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isChecking: state.isChecking,
        hasCheckedInitialAuth: state.hasCheckedInitialAuth,
    }));

    return { 
        user, 
        isAuthenticated, 
        isLoading: isChecking, 
        hasCheckedInitialAuth 
    };
};
