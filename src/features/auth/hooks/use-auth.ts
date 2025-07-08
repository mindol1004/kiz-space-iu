"use client"

import { useState } from "react"
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

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useAuthStore()
  const { toast } = useToast()

  const login = async (data: LoginData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "로그인에 실패했습니다")
      }

      setUser(result.user)
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      })
      router.push("/feed")
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "회원가입에 실패했습니다")
      }

      setUser(result.user)
      toast({
        title: "회원가입 성공",
        description: "KIZ-SPACE에 오신 것을 환영합니다!",
      })
      router.push("/feed")
    } catch (error) {
      toast({
        title: "회원가입 실패",
        description: error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    router.push("/")
  }

  return {
    login,
    register,
    logout,
    isLoading,
  }
}
