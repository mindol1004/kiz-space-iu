
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import type { BookmarkCategory, BookmarkAgeGroup } from "../types/bookmark-types"
import { CATEGORIES, AGE_GROUPS, getCategoryLabel, getAgeGroupLabel } from "@/shared/constants/common-data"

interface BookmarkFiltersProps {
  selectedCategory: BookmarkCategory | "all"
  selectedAgeGroup: BookmarkAgeGroup | "all"
  onCategoryChange: (category: BookmarkCategory | "all") => void
  onAgeGroupChange: (ageGroup: BookmarkAgeGroup | "all") => void
}

export function BookmarkFilters({ 
  selectedCategory, 
  selectedAgeGroup,
  onCategoryChange, 
  onAgeGroupChange 
}: BookmarkFiltersProps) {
  const hasActiveFilters = selectedCategory !== "all" || selectedAgeGroup !== "all"

  const resetFilters = () => {
    onCategoryChange("all")
    onAgeGroupChange("all")
  }

  const categories = [
    { value: "all", label: "전체" },
    ...CATEGORIES
  ]

  const ageGroups = [
    { value: "all", label: "전체" },
    ...AGE_GROUPS.filter(group => group.value !== "ALL")
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">필터</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="h-4 w-4 mr-1" />
              초기화
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Category and Age Group Selectors */}
          <div className="flex flex-wrap gap-2">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
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

            <Select value={selectedAgeGroup} onValueChange={onAgeGroupChange}>
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
          </div>

          {/* Active filters badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => onCategoryChange("all")}
                >
                  {getCategoryLabel(selectedCategory)}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {selectedAgeGroup !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => onAgeGroupChange("all")}
                >
                  {getAgeGroupLabel(selectedAgeGroup)}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
