"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface CreateGroupData {
  name: string
  description: string
  category: string
  isPrivate: boolean
  creatorId: string
}

export function useGroups() {
  const [groups, setGroups] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGroups = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/groups")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "그룹을 불러오는데 실패했습니다")
      }

      setGroups(result.groups)
    } catch (error) {
      setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return {
    groups,
    isLoading,
    error,
    refetch: fetchGroups,
  }
}

export function useCreateGroup() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const createGroup = async (data: CreateGroupData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "그룹 생성에 실패했습니다")
      }

      toast({
        title: "그룹 생성 완료",
        description: "새 그룹이 성공적으로 생성되었습니다.",
      })

      return result.group
    } catch (error) {
      toast({
        title: "그룹 생성 실패",
        description: error instanceof Error ? error.message : "그룹 생성 중 오류가 발생했습니다",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createGroup,
    isLoading,
  }
}

export function useJoinGroup() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const joinGroup = async (groupId: string, userId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "그룹 가입에 실패했습니다")
      }

      toast({
        title: result.joined ? "그룹 가입 완료" : "그룹 탈퇴 완료",
        description: result.joined ? "그룹에 성공적으로 가입했습니다." : "그룹에서 탈퇴했습니다.",
      })

      return result.joined
    } catch (error) {
      toast({
        title: "오류",
        description: error instanceof Error ? error.message : "그룹 가입/탈퇴 중 오류가 발생했습니다",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    joinGroup,
    isLoading,
  }
}
