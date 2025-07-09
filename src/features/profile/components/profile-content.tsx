"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Edit, Heart, MessageCircle, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileEditModal } from "./profile-edit-modal"
import { SettingsModal } from "@/features/settings/components/settings-modal"
import type { User } from "@/lib/schemas"

interface ProfileContentProps {
  user: User
  userChildren: any[]
  stats: Array<{
    label: string
    value: number
    icon: any
  }>
}

export function ProfileContent({ user, userChildren, stats }: ProfileContentProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const myPosts = [
    {
      id: "1",
      content: "신생아 수면 패턴에 대해 질문드려요. 우리 아기가 밤에 자주 깨는데 어떻게 해야 할까요?",
      likes: 12,
      comments: 8,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "2",
      content: "이유식 시작했는데 아기가 잘 안 먹어요. 다른 엄마들은 어떻게 하셨나요?",
      likes: 24,
      comments: 15,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
  ]

  return (
    <>
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* 프로필 헤더 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="relative inline-block">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={user.avatar || "/placeholder.svg?height=96&width=96"} />
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl">
                {user.nickname[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
              onClick={() => setShowEditModal(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-xl font-bold">{user.nickname}</h1>
          <p className="text-gray-600 text-sm">
            {user.location} • 가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}
          </p>
          <div className="flex justify-center items-center space-x-2 mt-2">
            <Badge className={user.verified ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gray-400"}>
              {user.verified ? "인증 회원" : "일반 회원"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => setShowSettingsModal(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* 통계 */}
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

        {/* 탭 컨텐츠 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">게시글</TabsTrigger>
              <TabsTrigger value="children">아이 정보</TabsTrigger>
              <TabsTrigger value="interests">관심사</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4 mt-4">
              {myPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.createdAt.toLocaleDateString()}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="children" className="space-y-4 mt-4">
              {userChildren.length > 0 ? (
                userChildren.map((child) => (
                  <Card key={child.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{child.name}</h4>
                          <p className="text-sm text-gray-600">
                            {child.age} • {child.gender === "boy" ? "남아" : "여아"}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{child.name[0]}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">등록된 아이 정보가 없습니다.</p>
                  <Button
                    className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    onClick={() => setShowEditModal(true)}
                  >
                    아이 정보 추가
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="interests" className="space-y-4 mt-4">
              <div className="flex flex-wrap gap-2">
                {user.interests?.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {interest}
                  </Badge>
                )) || (
                  <div className="text-center py-8 w-full">
                    <p className="text-gray-500">등록된 관심사가 없습니다.</p>
                    <Button
                      className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      onClick={() => setShowEditModal(true)}
                    >
                      관심사 추가
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <ProfileEditModal user={user} open={showEditModal} onOpenChange={setShowEditModal} />

      <SettingsModal open={showSettingsModal} onOpenChange={setShowSettingsModal} />
    </>
  )
}
