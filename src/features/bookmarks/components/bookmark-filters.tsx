
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import type { BookmarkCategory, BookmarkAgeGroup } from "../types/bookmark-types"
import { CATEGORIES, AGE_GROUPS, getCategoryLabel, getAgeGroupLabel } from "@/shared/constants/common-data"

interface BookmarkFiltersProps {
  selectedCategories: BookmarkCategory[]
  selectedAgeGroups: BookmarkAgeGroup[]
  onCategoriesChange: (categories: BookmarkCategory[]) => void
  onAgeGroupsChange: (ageGroups: BookmarkAgeGroup[]) => void
}

export function BookmarkFilters({ 
  selectedCategories, 
  selectedAgeGroups,
  onCategoriesChange, 
  onAgeGroupsChange 
}: BookmarkFiltersProps) {
  const hasActiveFilters = selectedCategories.length > 0 || selectedAgeGroups.length > 0

  const resetFilters = () => {
    onCategoriesChange([])
    onAgeGroupsChange([])
  }

  const toggleCategory = (category: BookmarkCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category))
    } else {
      onCategoriesChange([...selectedCategories, category])
    }
  }

  const toggleAgeGroup = (ageGroup: BookmarkAgeGroup) => {
    if (selectedAgeGroups.includes(ageGroup)) {
      onAgeGroupsChange(selectedAgeGroups.filter(a => a !== ageGroup))
    } else {
      onAgeGroupsChange([...selectedAgeGroups, ageGroup])
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">필터</h3>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="text-pink-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50"
            >
              <X className="h-4 w-4 mr-1" />
              초기화
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Category Badges */}
          <div>
            <h4 className="text-sm font-medium mb-2">카테고리</h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category.value as BookmarkCategory)
                return (
                  <Badge
                    key={category.value}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-none" 
                        : "hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-600"
                    }`}
                    onClick={() => toggleCategory(category.value as BookmarkCategory)}
                  >
                    {category.label}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Age Group Badges */}
          <div>
            <h4 className="text-sm font-medium mb-2">연령대</h4>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.filter(group => group.value !== "ALL").map((ageGroup) => {
                const isSelected = selectedAgeGroups.includes(ageGroup.value as BookmarkAgeGroup)
                return (
                  <Badge
                    key={ageGroup.value}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-none" 
                        : "hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-600"
                    }`}
                    onClick={() => toggleAgeGroup(ageGroup.value as BookmarkAgeGroup)}
                  >
                    {ageGroup.label}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Selected Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-500 mb-2">
                선택된 필터: {selectedCategories.length + selectedAgeGroups.length}개
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedCategories.map((category) => (
                  <Badge 
                    key={`selected-category-${category}`}
                    variant="secondary" 
                    className="text-xs"
                  >
                    {getCategoryLabel(category)}
                  </Badge>
                ))}
                {selectedAgeGroups.map((ageGroup) => (
                  <Badge 
                    key={`selected-age-${ageGroup}`}
                    variant="secondary" 
                    className="text-xs"
                  >
                    {getAgeGroupLabel(ageGroup)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
