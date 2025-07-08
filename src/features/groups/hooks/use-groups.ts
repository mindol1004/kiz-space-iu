"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface CreateGroupData {
  name: string
  description: string
  category: string
  isPrivate: boolean
  creatorId: string
}

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await fetch("/api/groups")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "그룹을 불러오는데 실패했습니다")
      }

      return result.groups
    },
  })
}

export function useGroup(groupId: string) {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const response = await fetch(`/api/groups/${groupId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "그룹 정보를 불러오는데 실패했습니다")
      }

      return result.group
    },
    enabled: !!groupId,
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: CreateGroupData) => {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "그룹 생성에 실패했습니다")
      }

      return result.group
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      toast({
        title: "그룹 생성 완료",
        description: "새 그룹이 성공적으로 생성되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "그룹 생성 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useJoinGroup() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ groupId, userId }: { groupId: string; userId: string }) => {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "그룹 가입에 실패했습니다")
      }

      return result
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["group", variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ["groups"] })
      toast({
        title: data.joined ? "그룹 가입 완료" : "그룹 탈퇴 완료",
        description: data.joined ? "그룹에 성공적으로 가입했습니다." : "그룹에서 탈퇴했습니다.",
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
