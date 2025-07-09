"use client"

import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WEEKLY_EVENTS } from "@/shared/constants/common-data"

export function WeeklyEvents() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-green-500" />
            이번 주 이벤트
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {WEEKLY_EVENTS.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-3 rounded-lg ${event.bgColor}`}
            >
              <h3 className="font-medium text-sm">{event.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{event.description}</p>
              <p className={`text-xs mt-2 ${event.textColor}`}>{event.date}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}