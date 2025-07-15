"use client"

import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWeeklyEvents } from "../hooks/use-explore"
import { Skeleton } from "@/components/ui/skeleton"

export function WeeklyEvents() {
  const { data: weeklyEvents, isLoading, error } = useWeeklyEvents()

  if (isLoading) {
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
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (error) {
    return <div className="text-red-500">주간 이벤트를 불러오는데 오류가 발생했습니다: {error.message}</div>
  }

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
          {weeklyEvents?.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-3 rounded-lg ${event.bgColor} text-${event.textColor}`}
            >
              <h3 className="font-medium text-sm">{event.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{event.description}</p>
              <p className={`text-xs mt-2`}>{new Date(event.date).toLocaleDateString()}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
