"use client"

import { useQuery } from "@tanstack/react-query"
import { type WeeklyEvent, type PopularGroup, type TrendingTag } from "@/features/explore/types/explore-types"

export function usePopularGroups() {
  return useQuery({
    queryKey: ["popularGroups"],
    queryFn: async (): Promise<PopularGroup[]> => {
      const response = await fetch("/api/groups")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "인기 그룹을 불러오는데 실패했습니다")
      }

      // Map Prisma Group model to PopularGroup interface
      return result.groups.map((group: any) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        memberCount: group.membersCount, // Map from membersCount
        category: group.category,
        isJoined: false, // This needs to be determined on the client-side or from a user-specific API
      }))
    },
  })
}

export function useTrendingTags() {
  return useQuery({
    queryKey: ["trendingTags"],
    queryFn: async (): Promise<TrendingTag[]> => {
      const response = await fetch("/api/tags/trending")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "트렌딩 태그를 불러오는데 실패했습니다")
      }

      // Map Prisma Tag model to TrendingTag interface
      return result.tags.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        count: tag.usageCount, // Map from usageCount
        growth: 0, // This needs to be calculated based on historical data
      }))
    },
  })
}

export function useWeeklyEvents() {
  return useQuery({
    queryKey: ["weeklyEvents"],
    queryFn: async (): Promise<WeeklyEvent[]> => {
      const response = await fetch("/api/events/weekly")
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "주간 이벤트를 불러오는데 실패했습니다")
      }

      // Map Prisma Event model to WeeklyEvent interface
      return result.events.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: new Date(event.startDate).toISOString(), // Map startDate to date string
        participants: event.participantsCount, // Map from participantsCount
        category: event.type, // Map Event's type to category (assuming this intent)
        bgColor: event.bgColor || "#000000", // Provide default if null
        textColor: event.textColor || "#FFFFFF", // Provide default if null
      }))
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
