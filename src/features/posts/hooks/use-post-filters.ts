import { usePostStore } from "@/shared/stores/post-store"
import { CATEGORIES, AGE_GROUPS } from "@/shared/constants/common-data"

export function usePostFilters() {
  const { 
    selectedCategory, 
    selectedAgeGroup, 
    setSelectedCategory, 
    setSelectedAgeGroup, 
    resetFilters 
  } = usePostStore()

  const categories = [
    { value: "all", label: "전체" },
    ...CATEGORIES
  ]

  const ageGroups = [
    { value: "all", label: "전체" },
    ...AGE_GROUPS.filter(group => group.value !== "ALL")
  ]

  const hasActiveFilters = selectedCategory !== "all" || selectedAgeGroup !== "all"

  const getSelectedCategoryLabel = () => {
    return categories.find(c => c.value === selectedCategory)?.label
  }

  const getSelectedAgeGroupLabel = () => {
    return ageGroups.find(a => a.value === selectedAgeGroup)?.label
  }

  return {
    selectedCategory,
    selectedAgeGroup,
    setSelectedCategory,
    setSelectedAgeGroup,
    resetFilters,
    categories,
    ageGroups,
    hasActiveFilters,
    getSelectedCategoryLabel,
    getSelectedAgeGroupLabel,
  }
}
