"use client"

import { useQuery } from "@tanstack/react-query"

interface SearchResult {
  posts: any[]
  users: any[]
  groups: any[]
  total: number
}

interface SearchFilters {
  type?: "all" | "posts" | "users" | "groups"
  category?: string
  dateRange?: "day" | "week" | "month" | "all"
}

export function useSearch(query: string, filters: SearchFilters = {}) {
  return useQuery({
    queryKey: ["search", query, filters],
    queryFn: async (): Promise<SearchResult> => {
      const params = new URLSearchParams()
      params.append("q", query)
      if (filters.type) params.append("type", filters.type)
      if (filters.category) params.append("category", filters.category)
      if (filters.dateRange) params.append("dateRange", filters.dateRange)

      const response = await fetch(`/api/search?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "검색에 실패했습니다")
      }

      return result
    },
    enabled: query.length > 0,
  })
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ["searchSuggestions", query],
    queryFn: async (): Promise<string[]> => {
      const response = await fetch(`/api/search/suggestions?q=${query}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "검색 제안을 불러오는데 실패했습니다")
      }

      return result.suggestions
    },
    enabled: query.length > 1,
  })
}

export function useRecentSearches(userId: string) {
  return useQuery({
    queryKey: ["recentSearches", userId],
    queryFn: async (): Promise<string[]> => {
      const response = await fetch(`/api/search/recent?userId=${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "최근 검색어를 불러오는데 실패했습니다")
      }

      return result.searches
    },
    enabled: !!userId,
  })
}
