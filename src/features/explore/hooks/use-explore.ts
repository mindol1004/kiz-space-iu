"use client"

import { useState, useMemo } from "react"
import { TRENDING_TAGS, POPULAR_GROUPS, WEEKLY_EVENTS } from "../data/explore-data"

export function useExplore() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredGroups = useMemo(() => {
    let filtered = POPULAR_GROUPS

    if (searchQuery) {
      filtered = filtered.filter(
        (group) =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((group) => group.category === selectedCategory)
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const filteredTags = useMemo(() => {
    if (!searchQuery) return TRENDING_TAGS

    return TRENDING_TAGS.filter((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(POPULAR_GROUPS.map((group) => group.category))]
    return uniqueCategories
  }, [])

  const stats = useMemo(
    () => ({
      totalGroups: POPULAR_GROUPS.length,
      totalMembers: POPULAR_GROUPS.reduce((sum, group) => sum + group.members, 0),
      totalTags: TRENDING_TAGS.length,
      totalEvents: WEEKLY_EVENTS.length,
    }),
    [],
  )

  return {
    // Data
    trendingTags: filteredTags,
    popularGroups: filteredGroups,
    weeklyEvents: WEEKLY_EVENTS,
    categories,
    stats,

    // State
    searchQuery,
    selectedCategory,

    // Actions
    setSearchQuery,
    setSelectedCategory,
    clearFilters: () => {
      setSearchQuery("")
      setSelectedCategory(null)
    },
  }
}
