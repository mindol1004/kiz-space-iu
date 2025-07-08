"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface UpdateUserData {
  nickname?: string
  location?: string
  interests?: string[]
  avatar?: string
  bio?: string
}

export function useUser(userId: string) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/users/${userId}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "사용자 정보를 불러오는데 실패했습니다")
        }

        setUser(result.user)
      } catch (error) {
        setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다")
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  return {
    user,
    isLoading,
    error,
  }
}

export function useUpdateUser() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const updateUser = async (userId: string, data: UpdateUserData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "사용자 정보 수정에 실패했습니다")
      }

      toast({
        title: "프로필 수정 완료",
        description: "프로필이 성공적으로 수정되었습니다.",
      })

      return result.user
    } catch (error) {
      toast({
        title: "프로필 수정 실패",
        description: error instanceof Error ? error.message : "프로필 수정 중 오류가 발생했습니다",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateUser,
    isLoading,
  }
}
