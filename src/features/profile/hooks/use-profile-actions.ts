"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface UpdateProfileData {
  name?: string
  bio?: string
  avatar?: string
  location?: string
  interests?: string[]
}

interface ShareProfileData {
  userId: string
  username: string
}

export function useProfileActions() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  const updateProfile = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdateProfileData }) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "프로필 업데이트에 실패했습니다")
      }

      return result.user
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] })
      queryClient.invalidateQueries({ queryKey: ["profile", variables.userId] })
      toast({
        title: "프로필 업데이트 완료",
        description: "프로필이 성공적으로 업데이트되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "프로필 업데이트 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const followUser = useMutation({
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
      queryClient.invalidateQueries({ queryKey: ["followers", variables.targetUserId] })
      queryClient.invalidateQueries({ queryKey: ["following", variables.userId] })

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

  const deleteAccount = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "계정 삭제에 실패했습니다")
      }

      return result
    },
    onSuccess: () => {
      queryClient.clear() // 모든 캐시 클리어
      toast({
        title: "계정 삭제 완료",
        description: "계정이 성공적으로 삭제되었습니다.",
      })
      router.push("/")
    },
    onError: (error) => {
      toast({
        title: "계정 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const shareProfile = async (data: ShareProfileData) => {
    const profileUrl = `${window.location.origin}/profile/${data.userId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.username}님의 프로필`,
          text: `KIZ-SPACE에서 ${data.username}님의 프로필을 확인해보세요!`,
          url: profileUrl,
        })
        toast({
          title: "공유 완료",
          description: "프로필이 성공적으로 공유되었습니다.",
        })
      } catch (error) {
        // 공유 취소 시 에러 무시
        if (error instanceof Error && error.name !== "AbortError") {
          fallbackShare(profileUrl)
        }
      }
    } else {
      fallbackShare(profileUrl)
    }
  }

  const fallbackShare = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "링크 복사 완료",
        description: "프로필 링크가 클립보드에 복사되었습니다.",
      })
    } catch (error) {
      toast({
        title: "공유 실패",
        description: "프로필 공유에 실패했습니다.",
        variant: "destructive",
      })
    }
  }

  const navigateToSettings = () => {
    router.push("/settings")
  }

  const navigateToSchedule = () => {
    router.push("/schedule")
  }

  const logout = () => {
    queryClient.clear() // 모든 캐시 클리어
    localStorage.removeItem("auth-token")
    sessionStorage.clear()
    router.push("/login")
    toast({
      title: "로그아웃 완료",
      description: "성공적으로 로그아웃되었습니다.",
    })
  }

  return {
    updateProfile,
    followUser,
    deleteAccount,
    shareProfile,
    navigateToSettings,
    navigateToSchedule,
    logout,
  }
}
