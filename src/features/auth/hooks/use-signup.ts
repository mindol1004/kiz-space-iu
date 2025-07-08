"use client"

import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface SignupData {
  email: string
  password: string
  name: string
  nickname: string
  birthDate: string
  children: Array<{
    name: string
    birthDate: string
    gender: "male" | "female"
  }>
  interests: string[]
  location?: string
  agreeToTerms: boolean
  agreeToPrivacy: boolean
  agreeToMarketing?: boolean
}

interface SignupResponse {
  user: {
    id: string
    email: string
    name: string
    nickname: string
  }
  token: string
}

export function useSignup() {
  const { toast } = useToast()
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: SignupData): Promise<SignupResponse> => {
      // 데이터 검증
      if (!data.email || !data.password || !data.name || !data.nickname) {
        throw new Error("필수 정보를 모두 입력해주세요")
      }

      if (!data.email.includes("@")) {
        throw new Error("올바른 이메일 형식을 입력해주세요")
      }

      if (data.password.length < 8) {
        throw new Error("비밀번호는 8자 이상이어야 합니다")
      }

      if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(data.password)) {
        throw new Error("비밀번호는 영문과 숫자를 포함해야 합니다")
      }

      if (data.nickname.length < 2 || data.nickname.length > 20) {
        throw new Error("닉네임은 2-20자 사이여야 합니다")
      }

      if (!data.agreeToTerms || !data.agreeToPrivacy) {
        throw new Error("필수 약관에 동의해주세요")
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "회원가입에 실패했습니다")
      }

      return result
    },
    onSuccess: (data) => {
      // 토큰 저장
      localStorage.setItem("auth-token", data.token)

      toast({
        title: "회원가입 완료! 🎉",
        description: `${data.user.name}님, KIZ-SPACE에 오신 것을 환영합니다!`,
      })

      // 온보딩 페이지로 이동
      router.push("/onboarding")
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

export function useCheckEmailAvailability() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "이메일 확인에 실패했습니다")
      }

      return result.available
    },
  })
}

export function useCheckNicknameAvailability() {
  return useMutation({
    mutationFn: async (nickname: string) => {
      const response = await fetch("/api/auth/check-nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "닉네임 확인에 실패했습니다")
      }

      return result.available
    },
  })
}
