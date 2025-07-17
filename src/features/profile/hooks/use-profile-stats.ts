
"use client"

import { useQuery } from "@tanstack/react-query"
import { Edit, Heart, MessageCircle, Bookmark } from "lucide-react"
import { ProfileAPI } from "../api/profile-api"
import type { ProfileStat } from "../types/profile-types"

export function useProfileStats(userId?: string) {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["profile-stats", userId],
    queryFn: () => ProfileAPI.getProfileStats(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  })

  // 기본 통계값 (API에서 데이터가 없을 때 사용)
  const defaultStats: ProfileStat[] = [
    { label: "게시글", value: 0, icon: Edit },
    { label: "좋아요", value: 0, icon: Heart },
    { label: "댓글", value: 0, icon: MessageCircle },
    { label: "북마크", value: 0, icon: Bookmark },
  ]

  return { 
    stats: stats || defaultStats, 
    isLoading, 
    error 
  }
}
