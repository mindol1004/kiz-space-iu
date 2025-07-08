"use client"

import { motion } from "framer-motion"
import { Settings, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProfileActions } from "../hooks/use-profile-actions"

export function ProfileActions() {
  const { navigateToSettings, navigateToSchedule, logout } = useProfileActions()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-3"
    >
      <Button variant="outline" className="w-full justify-start bg-transparent" onClick={navigateToSettings}>
        <Settings className="h-4 w-4 mr-2" />
        설정
      </Button>
      <Button variant="outline" className="w-full justify-start bg-transparent" onClick={navigateToSchedule}>
        <Calendar className="h-4 w-4 mr-2" />내 일정 관리
      </Button>
      <Button
        variant="outline"
        className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
        onClick={logout}
      >
        로그아웃
      </Button>
    </motion.div>
  )
}
