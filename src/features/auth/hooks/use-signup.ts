"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { SignupFormData } from "../types/auth-types"

export function useSignup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signup = async (formData: SignupFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // 여기에 실제 회원가입 API 호출 로직 구현
      // 현재는 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 성공 시 메인 페이지로 이동
      router.push("/(main)")
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const validateStep = (step: number, formData: SignupFormData): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.email &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword &&
          formData.password.length >= 8
        )
      case 2:
        return !!(formData.nickname && formData.region)
      case 3:
        return true // 자녀 정보는 선택사항
      case 4:
        return true // 관심사도 선택사항
      default:
        return false
    }
  }

  return {
    signup,
    validateStep,
    isLoading,
    error,
  }
}
