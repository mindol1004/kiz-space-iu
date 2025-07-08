"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
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
  const { setUser } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
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
      setUser(user)
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
}

export function useRegister() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
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
      setUser(user)
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
}

export function useLogout() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      // 로그아웃 API 호출 (필요한 경우)
      await fetch("/api/auth/logout", { method: "POST" })
    },
    onSuccess: () => {
      setUser(null)
      queryClient.clear()
      router.push("/")
    },
  })
}
