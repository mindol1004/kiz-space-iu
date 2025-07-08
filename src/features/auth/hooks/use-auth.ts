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
  location: string
  interests: string[]
}

export function useLogin() {
  const router = useRouter()
  const { login: authStoreLogin } = useAuthStore() // 이름 충돌을 피하기 위해 변경
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "로그인에 실패했습니다")
      }

      return result.user
    },
    onSuccess: (user) => {
      authStoreLogin(user) // 변경된 이름 사용
      queryClient.setQueryData(["currentUser"], user)
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      })
      router.push("/feed")
    },
    onError: (error) => {
      toast({
        title: "로그인 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return {
    login: mutation.mutateAsync, // mutateAsync를 'login'으로 반환
    isPending: mutation.isPending, // isPending을 반환
  }
}

export function useRegister() {
  const router = useRouter()
  const { login } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "회원가입에 실패했습니다")
      }

      return result.user
    },
    onSuccess: (user) => {
      login(user)
      queryClient.setQueryData(["currentUser"], user)
      toast({
        title: "회원가입 성공",
        description: "KIZ-SPACE에 오신 것을 환영합니다!",
      })
      router.push("/feed")
    },
    onError: (error) => {
      toast({
        title: "회원가입 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return {
    register: mutation.mutateAsync, // mutateAsync를 'register'로 반환
    isPending: mutation.isPending,
  }
}

export function useLogout() {
  const router = useRouter()
  const { logout: authStoreLogout } = useAuthStore() // 이름 충돌을 피하기 위해 변경
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      // 로그아웃 API 호출 (필요한 경우)
      await fetch("/api/auth/logout", { method: "POST" })
    },
    onSuccess: () => {
      authStoreLogout() // 변경된 이름 사용
      queryClient.clear()
      router.push("/")
    },
  })

  return {
    logout: mutation.mutateAsync, // mutateAsync를 'logout'으로 반환
    isPending: mutation.isPending,
  }
}
