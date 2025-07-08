"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"
import type { BookmarkCategory } from "../types/bookmark-types"

interface BookmarkFiltersProps {
  selectedCategory: BookmarkCategory | "all"
  onCategoryChange: (category: BookmarkCategory | "all") => void
}

const categories = [
  { value: "all", label: "전체", count: 24 },
  { value: "pregnancy", label: "임신", count: 8 },
  { value: "newborn", label: "신생아", count: 6 },
  { value: "education", label: "교육", count: 5 },
  { value: "health", label: "건강", count: 3 },
  { value: "tips", label: "팁", count: 2 },
] as const

export function BookmarkFilters({ selectedCategory, onCategoryChange }: BookmarkFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">카테고리별 필터</h3>
          {selectedCategory !== "all" && (
            <Button variant="ghost" size="sm" onClick={() => onCategoryChange("all")}>
              <X className="h-4 w-4 mr-1" />
              초기화
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/80 transition-colors"
              onClick={() => onCategoryChange(category.value as BookmarkCategory | "all")}
            >
              {category.label}
              <span className="ml-1 text-xs opacity-70">({category.count})</span>
            </Badge>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>총 북마크 수</span>
            <span className="font-semibold">24개</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
