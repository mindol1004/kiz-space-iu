"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { toast } from "@/hooks/use-toast"

interface UpdateProfileData {
  nickname?: string
  location?: string
  interests?: string[]
  avatar?: string
}

interface FollowUserData {
  userId: string
}

export function useProfileActions() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, logout } = useAuthStore()

  // 프로필 업데이트
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!user?.id) throw new Error("User not authenticated")

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }

      return response.json()
    },
    onSuccess: (data) => {
      // 사용자 정보 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] })
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] })

      toast({
        title: "프로필 업데이트 완료",
        description: "프로필이 성공적으로 업데이트되었습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "프로필 업데이트 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // 사용자 팔로우/언팔로우
  const followUserMutation = useMutation({
    mutationFn: async ({ userId }: FollowUserData) => {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to follow user")
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] })
      queryClient.invalidateQueries({ queryKey: ["followers", variables.userId] })
      queryClient.invalidateQueries({ queryKey: ["following", user?.id] })

      toast({
        title: data.isFollowing ? "팔로우 완료" : "언팔로우 완료",
        description: data.isFollowing ? "사용자를 팔로우했습니다." : "사용자를 언팔로우했습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "팔로우 처리 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // 계정 삭제
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated")

      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete account")
      }

      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "계정 삭제 완료",
        description: "계정이 성공적으로 삭제되었습니다.",
      })

      // 모든 캐시 클리어 후 로그아웃
      queryClient.clear()
      logout()
      router.push("/")
    },
    onError: (error: Error) => {
      toast({
        title: "계정 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // 설정 페이지로 이동
  const handleSettings = () => {
    router.push("/settings")
  }

  // 일정 관리 페이지로 이동
  const handleSchedule = () => {
    router.push("/schedule")
  }

  // 로그아웃
  const handleLogout = () => {
    // 모든 쿼리 캐시 클리어
    queryClient.clear()
    logout()

    toast({
      title: "로그아웃 완료",
      description: "성공적으로 로그아웃되었습니다.",
    })

    router.push("/")
  }

  // 프로필 수정
  const handleUpdateProfile = (data: UpdateProfileData) => {
    updateProfileMutation.mutate(data)
  }

  // 사용자 팔로우/언팔로우
  const handleFollowUser = (userId: string) => {
    followUserMutation.mutate({ userId })
  }

  // 계정 삭제
  const handleDeleteAccount = () => {
    if (window.confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      deleteAccountMutation.mutate()
    }
  }

  // 프로필 공유
  const handleShareProfile = async () => {
    if (!user?.id) return

    const profileUrl = `${window.location.origin}/profile/${user.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.nickname || user.email}의 프로필`,
          text: "KIZ-SPACE에서 프로필을 확인해보세요!",
          url: profileUrl,
        })
      } catch (error) {
        // 공유 취소 시 에러 무시
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Share failed:", error)
        }
      }
    } else {
      // Web Share API 미지원 시 클립보드에 복사
      try {
        await navigator.clipboard.writeText(profileUrl)
        toast({
          title: "링크 복사 완료",
          description: "프로필 링크가 클립보드에 복사되었습니다.",
        })
      } catch (error) {
        toast({
          title: "링크 복사 실패",
          description: "링크 복사에 실패했습니다.",
          variant: "destructive",
        })
      }
    }
  }

  return {
    // 액션 함수들
    handleSettings,
    handleSchedule,
    handleLogout,
    handleUpdateProfile,
    handleFollowUser,
    handleDeleteAccount,
    handleShareProfile,

    // 로딩 상태들
    isUpdatingProfile: updateProfileMutation.isPending,
    isFollowingUser: followUserMutation.isPending,
    isDeletingAccount: deleteAccountMutation.isPending,

    // 에러 상태들
    updateProfileError: updateProfileMutation.error,
    followUserError: followUserMutation.error,
    deleteAccountError: deleteAccountMutation.error,
  }
}
