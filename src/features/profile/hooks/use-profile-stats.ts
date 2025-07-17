
"use client"

import { useQuery } from "@tanstack/react-query"
import { Edit, Heart, MessageCircle, Bookmark } from "lucide-react"
import { ProfileAPI } from "../api/profile-api"
import type { ProfileStat } from "../types/profile-types"

export function useProfileStats(userId?: string) {
  const { data: statsData, isLoading, error } = useQuery({
    queryKey: ["profile-stats", userId],
    queryFn: () => ProfileAPI.getProfileStats(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  })

  // 아이콘 매핑
  const iconMap = {
    Edit,
    Heart,
    MessageCircle,
    Bookmark,
  }

  // API 응답을 ProfileStat 형태로 변환
  const stats: ProfileStat[] = statsData?.map((stat: any) => ({
    label: stat.label,
    value: stat.value,
    icon: iconMap[stat.icon as keyof typeof iconMap] || Edit,
  })) || [
    { label: "게시글", value: 0, icon: Edit },
    { label: "좋아요", value: 0, icon: Heart },
    { label: "댓글", value: 0, icon: MessageCircle },
    { label: "북마크", value: 0, icon: Bookmark },
  ]

  return { 
    stats, 
    isLoading, 
    error 
  }
}
