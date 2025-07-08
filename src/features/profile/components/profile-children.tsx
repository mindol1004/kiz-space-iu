"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockChildren } from "@/lib/mock-data"
import type { ProfileUser } from "../types/profile-types"

interface ProfileChildrenProps {
  user: ProfileUser
}

export function ProfileChildren({ user }: ProfileChildrenProps) {
  const userChildren = mockChildren.filter((child) => child.parentId === user._id)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">자녀 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {userChildren.map((child, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    child.gender === "female" ? "bg-pink-400" : "bg-blue-400"
                  }`}
                >
                  {child.name[0]}
                </div>
                <div>
                  <p className="font-medium text-sm">{child.name}</p>
                  <p className="text-xs text-gray-600">{child.age}세</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {child.gender === "female" ? "여아" : "남아"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
