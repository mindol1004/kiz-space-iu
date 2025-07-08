"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { POPULAR_GROUPS } from "../data/explore-data"

export function PopularGroups() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-purple-500" />
            인기 그룹
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {POPULAR_GROUPS.map((group, index) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div>
                <h3 className="font-medium text-sm">{group.name}</h3>
                <p className="text-xs text-gray-500">{group.members.toLocaleString()}명 참여</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {group.category}
              </Badge>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
