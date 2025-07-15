"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { usePopularGroups } from "../hooks/use-explore"
import { GroupDetailModal } from "./group-detail-modal"
import { PopularGroup } from "../types/explore-types"
import { Skeleton } from "@/components/ui/skeleton"

export function PopularGroups() {
  const { data: popularGroups, isLoading, error } = usePopularGroups()
  const [selectedGroup, setSelectedGroup] = useState<PopularGroup | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleGroupClick = (group: PopularGroup) => {
    setSelectedGroup(group)
    setShowModal(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">인기 그룹</h3>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">인기 그룹을 불러오는데 오류가 발생했습니다: {error.message}</div>
  }

  return (
    <>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">인기 그룹</h3>
        <div className="space-y-3">
          {popularGroups?.map((group, index) => (
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
