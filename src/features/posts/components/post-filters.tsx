
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePostStore } from "@/shared/stores/post-store"

export function PostFilters() {
  const { selectedCategory, selectedAgeGroup, setSelectedCategory, setSelectedAgeGroup } = usePostStore()

  const categories = [
    { value: "all", label: "전체" },
    { value: "PLAY", label: "놀이/활동" },
    { value: "HEALTH", label: "건강/안전" },
    { value: "EDUCATION", label: "교육" },
    { value: "FOOD", label: "식사" },
    { value: "PRODUCTS", label: "육아용품" },
    { value: "ADVICE", label: "고민상담" },
    { value: "PREGNANCY", label: "임신" },
    { value: "NEWBORN", label: "신생아" },
    { value: "LIFESTYLE", label: "라이프스타일" },
  ]

  const ageGroups = [
    { value: "all", label: "전체 연령" },
    { value: "PREGNANCY", label: "임신" },
    { value: "NEWBORN_0_6M", label: "신생아 (0-6개월)" },
    { value: "INFANT_6_12M", label: "영아 (6-12개월)" },
    { value: "TODDLER_1_3Y", label: "유아 (1-3세)" },
    { value: "PRESCHOOL_3_5Y", label: "유치원 (3-5세)" },
    { value: "SCHOOL_5_8Y", label: "초등 저학년 (5-8세)" },
    { value: "TWEEN_8_12Y", label: "초등 고학년 (8-12세)" },
    { value: "ALL", label: "전체" },
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
