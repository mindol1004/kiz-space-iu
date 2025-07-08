"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface UpdateUserData {
  nickname?: string
  location?: string
  interests?: string[]
  avatar?: string
  bio?: string
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "사용자 정보를 불러오는데 실패했습니다")
      }

      return result.user
    },
    enabled: !!userId,
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "사용자 정보를 불러오는데 실패했습니다")
      }

      return result.user
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdateUserData }) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "사용자 정보 수정에 실패했습니다")
      }

      return result.user
    },
    onSuccess: (user, variables) => {
      queryClient.setQueryData(["user", variables.userId], user)
      queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      toast({
        title: "프로필 수정 완료",
        description: "프로필이 성공적으로 수정되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "프로필 수정 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useFollowUser() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ userId, targetUserId }: { userId: string; targetUserId: string }) => {
      const response = await fetch(`/api/users/${targetUserId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "팔로우 처리에 실패했습니다")
      }

      return result
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.targetUserId] })
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] })
      toast({
        title: data.isFollowing ? "팔로우 완료" : "언팔로우 완료",
        description: data.isFollowing ? "사용자를 팔로우했습니다." : "사용자를 언팔로우했습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "오류",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
