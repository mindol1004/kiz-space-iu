"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios-config"
import { useToast } from "@/hooks/use-toast"

export function useFollowUser() {
  const [isFollowing, setIsFollowing] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const followMutation = useMutation({
    mutationFn: async ({ userId, targetUserId }: { userId: string; targetUserId: string }) => {
      const response = await axiosInstance.post(`/users/${targetUserId}/follow`, {
        userId,
      })
      return response.data
    },
    onMutate: () => {
      setIsFollowing(true)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast({
        title: data.isFollowing ? "팔로우 완료" : "언팔로우 완료",
        description: data.isFollowing ? "사용자를 팔로우했습니다." : "사용자를 언팔로우했습니다.",
      })
    },
    onError: () => {
      toast({
        title: "오류 발생",
        description: "팔로우 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsFollowing(false)
    },
  })

  return {
    followUser: followMutation.mutate,
    isFollowing,
  }
}