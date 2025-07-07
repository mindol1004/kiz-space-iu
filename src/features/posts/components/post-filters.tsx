"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePostStore } from "@/stores/post-store"

export function PostFilters() {
  const { selectedCategory, selectedAgeGroup, setSelectedCategory, setSelectedAgeGroup } = usePostStore()

  const categories = [
    { value: "all", label: "전체" },
    { value: "play", label: "놀이/활동" },
    { value: "health", label: "건강/안전" },
    { value: "education", label: "교육" },
    { value: "food", label: "식사" },
    { value: "products", label: "육아용품" },
    { value: "advice", label: "고민상담" },
  ]

  const ageGroups = [
    { value: "all", label: "전체 연령" },
    { value: "0-2", label: "0-2세" },
    { value: "3-5", label: "3-5세" },
    { value: "6-8", label: "6-8세" },
    { value: "9-12", label: "9-12세" },
  ]

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div>
        <h3 className="font-medium text-sm text-gray-700 mb-3">카테고리</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
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
          {ageGroups.map((ageGroup) => (
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
