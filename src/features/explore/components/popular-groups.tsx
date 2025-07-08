"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { GroupDetailModal } from "./group-detail-modal"
import type { PopularGroup } from "../types/explore-types"

const mockGroups: PopularGroup[] = [
  {
    id: "1",
    name: "신생아 케어 모임",
    description: "0-12개월 아기를 키우는 부모들의 모임",
    memberCount: 1234,
    category: "신생아",
    isJoined: false,
  },
  {
    id: "2",
    name: "워킹맘 소통방",
    description: "일하는 엄마들의 육아와 커리어 이야기",
    memberCount: 856,
    category: "워킹맘",
    isJoined: true,
  },
  {
    id: "3",
    name: "유치원 준비반",
    description: "유치원 입학을 준비하는 부모들",
    memberCount: 642,
    category: "유치원",
    isJoined: false,
  },
]

export function PopularGroups() {
  const [selectedGroup, setSelectedGroup] = useState<PopularGroup | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleGroupClick = (group: PopularGroup) => {
    setSelectedGroup(group)
    setShowModal(true)
  }

  return (
    <>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">인기 그룹</h3>
        <div className="space-y-3">
          {mockGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => handleGroupClick(group)}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{group.name[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{group.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {group.category}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>{group.memberCount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={group.isJoined ? "outline" : "default"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle join/leave logic
                      }}
                      className={
                        !group.isJoined
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                          : ""
                      }
                    >
                      {group.isJoined ? "가입됨" : "가입"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedGroup && <GroupDetailModal group={selectedGroup} open={showModal} onOpenChange={setShowModal} />}
    </>
  )
}
