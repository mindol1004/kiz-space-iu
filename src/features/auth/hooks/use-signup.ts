"use client"

import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useValidateEmail, useValidatePassword, useValidateNickname } from "@/features/auth/hooks/use-validation"
import { AuthAPI } from "../api/auth-api"
import type { SignupFormData } from "../types/auth-types"
import type { RegisterRequest } from "../types/auth-api-types"

export function useSignup() {
  const { toast } = useToast()
  const router = useRouter()
  const { validateEmail } = useValidateEmail();
  const { validatePassword } = useValidatePassword();
  const { validateNickname } = useValidateNickname();

  const mutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      // 데이터 검증
      if (!validateEmail(data.email)) {
        throw new Error("올바른 이메일 형식을 입력해주세요")
      }

      if (!validatePassword(data.password)) {
        throw new Error("비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다")
      }

      if (data.password !== data.confirmPassword) {
        throw new Error("비밀번호가 일치하지 않습니다.")
      }

      if (!validateNickname(data.nickname)) {
        throw new Error("닉네임은 2-20자 사이여야 합니다")
      }

      if (!data.region) {
        throw new Error("거주 지역을 선택해주세요")
      }

      // SignupFormData를 RegisterRequest 형태로 변환
      const registerData: RegisterRequest = {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        location: data.region,
        interests: data.interests,
        children: data.children.map(child => ({
          name: child.name,
          age: parseInt(child.age) || 0,
          gender: child.gender
        })),
        bio: data.bio
      }

      return AuthAPI.register(registerData)
    },
    onSuccess: (data) => {
      toast({
        title: "회원가입 완료! 🎉",
        description: `${data.user.nickname}님, KIZ-SPACE에 오신 것을 환영합니다!`,
      })

      // 로그인 페이지로 이동
      router.push("/login")
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
    signup: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
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
