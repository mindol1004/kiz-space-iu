"use client"

import { useQuery } from "@tanstack/react-query"

interface PopularGroup {
  id: string
  name: string
  description: string
  memberCount: number
  category: string
  isPrivate: boolean
}

interface TrendingTag {
  id: string
  name: string
  postCount: number
  trend: "up" | "down" | "stable"
}

interface WeeklyEvent {
  id: string
  title: string
  description: string
  date: string
  location: string
  participantCount: number
}

export function usePopularGroups() {
  return useQuery({
    queryKey: ["popularGroups"],
    queryFn: async (): Promise<PopularGroup[]> => {
      const response = await fetch("/api/explore/groups")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "인기 그룹을 불러오는데 실패했습니다")
      }

      return result.groups
    },
  })
}

export function useTrendingTags() {
  return useQuery({
    queryKey: ["trendingTags"],
    queryFn: async (): Promise<TrendingTag[]> => {
      const response = await fetch("/api/explore/tags")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "트렌딩 태그를 불러오는데 실패했습니다")
      }

      return result.tags
    },
  })
}

export function useWeeklyEvents() {
  return useQuery({
    queryKey: ["weeklyEvents"],
    queryFn: async (): Promise<WeeklyEvent[]> => {
      const response = await fetch("/api/explore/events")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "주간 이벤트를 불러오는데 실패했습니다")
      }

      return result.events
    },
  })
}

export function useExploreContent() {
  const popularGroups = usePopularGroups()
  const trendingTags = useTrendingTags()
  const weeklyEvents = useWeeklyEvents()

  return {
    popularGroups: popularGroups.data || [],
    trendingTags: trendingTags.data || [],
    weeklyEvents: weeklyEvents.data || [],
    isLoading: popularGroups.isLoading || trendingTags.isLoading || weeklyEvents.isLoading,
    error: popularGroups.error || trendingTags.error || weeklyEvents.error,
  }
}
