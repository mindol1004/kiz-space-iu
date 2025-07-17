
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { ProfileAPI } from "../api/profile-api"
import type { UserProfile } from "../types/profile-types"

export function useProfile(userId?: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => ProfileAPI.getProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  })

  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<UserProfile>) => ProfileAPI.updateProfile(userId!, data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile", userId], updatedProfile)
      queryClient.invalidateQueries({ queryKey: ["profile", userId] })
      toast({
        title: "프로필 업데이트 완료",
        description: "프로필이 성공적으로 업데이트되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "프로필 업데이트 실패",
        description: "프로필 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    },
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => ProfileAPI.uploadAvatar(userId!, file),
    onSuccess: (avatarUrl) => {
      if (profile) {
        const updatedProfile = { ...profile, avatar: avatarUrl }
        queryClient.setQueryData(["profile", userId], updatedProfile)
      }
      toast({
        title: "프로필 사진 업데이트 완료",
        description: "프로필 사진이 성공적으로 업데이트되었습니다.",
      })
    },
    onError: () => {
      toast({
        title: "프로필 사진 업데이트 실패",
        description: "프로필 사진 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    },
  })

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
    uploadAvatar: uploadAvatarMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
  }
}
