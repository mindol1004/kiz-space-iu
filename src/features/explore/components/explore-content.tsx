"use client"

import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TrendingTags } from "./trending-tags"
import { PopularGroups } from "./popular-groups"
import { WeeklyEvents } from "./weekly-events"

export function ExploreContent() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input placeholder="관심있는 주제를 검색해보세요" className="pl-10" />
      </motion.div>

      <TrendingTags />
      <PopularGroups />
      <WeeklyEvents />
    </div>
  )
}
