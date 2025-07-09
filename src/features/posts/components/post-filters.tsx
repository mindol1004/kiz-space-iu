
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePostStore } from "@/shared/stores/post-store"
import { FILTER_CATEGORIES, FILTER_AGE_GROUPS } from "@/shared/constants/common-data"

export function PostFilters() {
  const { selectedCategory, selectedAgeGroup, setSelectedCategory, setSelectedAgeGroup } = usePostStore()

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div>
        <h3 className="font-medium text-sm text-gray-700 mb-3">카테고리</h3>
        <div className="flex flex-wrap gap-2">
          {FILTER_CATEGORIES.map((category) => (
            <motion.div key={category.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className={
                  selectedCategory === category.value
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    : ""
                }
              >
                {category.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-sm text-gray-700 mb-3">연령대</h3>
        <div className="flex flex-wrap gap-2">
          {FILTER_AGE_GROUPS.map((ageGroup) => (
            <motion.div key={ageGroup.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge
                variant={selectedAgeGroup === ageGroup.value ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedAgeGroup === ageGroup.value
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    : ""
                }`}
                onClick={() => setSelectedAgeGroup(ageGroup.value)}
              >
                {ageGroup.label}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
