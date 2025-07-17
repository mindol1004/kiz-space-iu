
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
  { value: "all", label: "전체" },
  { value: "pregnancy", label: "임신" },
  { value: "newborn", label: "신생아" },
  { value: "education", label: "교육" },
  { value: "health", label: "건강" },
  { value: "tips", label: "팁" },
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
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
