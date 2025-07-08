"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { ProfileStat } from "../types/profile-types"

interface ProfileStatsProps {
  stats: ProfileStat[]
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div key={stat.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Icon className="h-5 w-5 mx-auto mb-2 text-pink-500" />
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
