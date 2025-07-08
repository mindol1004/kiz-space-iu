"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import type { SignupFormData } from "../types/auth-types"

interface SignupResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    nickname: string
  }
}

export function useSignup() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const signupMutation = useMutation({
    mutationFn: async (formData: SignupFormData): Promise<SignupResponse> => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nickname: formData.nickname,
          region: formData.region,
          children: formData.children,
          interests: formData.interests,
          profileImage: formData.profileImage,
          bio: formData.bio,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "회원가입 중 오류가 발생했습니다.")
      }

      return response.json()
    },
    onSuccess: (data) => {
      toast.success("회원가입이 완료되었습니다!")
      setError(null)
      // 성공 시 로그인 페이지로 이동
      router.push("/login")
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "회원가입 중 오류가 발생했습니다."
      setError(errorMessage)
      toast.error(errorMessage)
    },
  })

  const signup = async (formData: SignupFormData) => {
    setError(null)
    signupMutation.mutate(formData)
  }

  const validateStep = (step: number, formData: SignupFormData): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.email &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.password.length >= 8 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        )
      case 2:
        return !!(formData.nickname && formData.region && formData.nickname.length >= 2)
      case 3:
        return true // 자녀 정보는 선택사항
      case 4:
        return true // 관심사도 선택사항
      default:
        return false
    }
  }

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /^(?=.*[a-zA-Z])(?=.*\d)/.test(password)
  }

  const validateNickname = (nickname: string): boolean => {
    return nickname.length >= 2 && nickname.length <= 20
  }

  return {
    signup,
    validateStep,
    validateEmail,
    validatePassword,
    validateNickname,
    isLoading: signupMutation.isPending,
    error: error || signupMutation.error?.message,
    isSuccess: signupMutation.isSuccess,
    reset: () => {
      setError(null)
      signupMutation.reset()
    },
  }
}
