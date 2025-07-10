
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useToast } from "@/hooks/use-toast"

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  nickname: string
  region?: string
  children?: Array<{
    name: string
    age: number
    gender: string
  }>
  interests?: string[]
  profileImage?: string
  bio?: string
}

export function useLogin() {
  const router = useRouter()
  const { login } = useAuthStore()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "로그인에 실패했습니다")
      }

      return response.json()
    },
    onSuccess: (data) => {
      // 토큰은 쿠키에 저장되므로 사용자 정보만 저장
      login(data.user)
      
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      })
      
      router.push("/feed")
    },
    onError: (error: Error) => {
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
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("로그아웃에 실패했습니다")
      }

      return response.json()
    },
    onSuccess: () => {
      logout()
      queryClient.clear()
      
      toast({
        title: "로그아웃 완료",
        description: "안전하게 로그아웃되었습니다.",
      })
      
      router.push("/login")
    },
    onError: (error: Error) => {
      toast({
        title: "로그아웃 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useRegister() {
  const router = useRouter()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "회원가입에 실패했습니다")
      }

      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "회원가입 성공",
        description: "로그인 페이지로 이동합니다.",
      })
      
      router.push("/login")
    },
    onError: (error: Error) => {
      toast({
        title: "회원가입 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
