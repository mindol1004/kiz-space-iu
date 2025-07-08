"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface CreateChildData {
  name: string
  age: string
  gender: "boy" | "girl"
  parentId: string
}

interface UpdateChildData {
  name?: string
  age?: string
  gender?: "boy" | "girl"
}

export function useChildren(parentId: string) {
  const [children, setChildren] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChildren = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/children?parentId=${parentId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "자녀 정보를 불러오는데 실패했습니다")
      }

      setChildren(result.children)
    } catch (error) {
      setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (parentId) {
      fetchChildren()
    }
  }, [parentId])

  return {
    children,
    isLoading,
    error,
    refetch: fetchChildren,
  }
}

export function useCreateChild() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const createChild = async (data: CreateChildData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "자녀 정보 추가에 실패했습니다")
      }

      toast({
        title: "자녀 정보 추가 완료",
        description: "자녀 정보가 성공적으로 추가되었습니다.",
      })

      return result.child
    } catch (error) {
      toast({
        title: "자녀 정보 추가 실패",
        description: error instanceof Error ? error.message : "자녀 정보 추가 중 오류가 발생했습니다",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createChild,
    isLoading,
  }
}

export function useUpdateChild() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const updateChild = async (childId: string, data: UpdateChildData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/children/${childId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "자녀 정보 수정에 실패했습니다")
      }

      toast({
        title: "자녀 정보 수정 완료",
        description: "자녀 정보가 성공적으로 수정되었습니다.",
      })

      return result.child
    } catch (error) {
      toast({
        title: "자녀 정보 수정 실패",
        description: error instanceof Error ? error.message : "자녀 정보 수정 중 오류가 발생했습니다",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateChild,
    isLoading,
  }
}

export function useDeleteChild() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const deleteChild = async (childId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/children/${childId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "자녀 정보 삭제에 실패했습니다")
      }

      toast({
        title: "자녀 정보 삭제 완료",
        description: "자녀 정보가 성공적으로 삭제되었습니다.",
      })

      return true
    } catch (error) {
      toast({
        title: "자녀 정보 삭제 실패",
        description: error instanceof Error ? error.message : "자녀 정보 삭제 중 오류가 발생했습니다",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteChild,
    isLoading,
  }
}
