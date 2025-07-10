
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { usePostFilters } from "../hooks/use-post-filters"

export function PostFilters() {
  const {
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
  } = usePostFilters()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="연령대" />
          </SelectTrigger>
          <SelectContent>
            {ageGroups.map((ageGroup) => (
              <SelectItem key={ageGroup.value} value={ageGroup.value}>
                {ageGroup.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            필터 초기화
          </Button>
        )}
      </div>

      {/* Active filters badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== "all" && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setSelectedCategory("all")}
            >
              {getSelectedCategoryLabel()}
              <X className="h-3 w-3" />
            </Badge>
          )}
          {selectedAgeGroup !== "all" && (
            <Badge 
              variant="secondary" 
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setSelectedAgeGroup("all")}
            >
              {getSelectedAgeGroupLabel()}
              <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
