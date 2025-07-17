
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Edit, Heart, MessageCircle, Settings, UserPlus, UserMinus, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileEditModal } from "./profile-edit-modal"
import { SettingsModal } from "@/features/settings/components/settings-modal"
import { useProfile } from "../hooks/use-profile"
import { useProfileStats } from "../hooks/use-profile-stats"
import { useUserPosts } from "../hooks/use-user-posts"
import { useFollowUser } from "@/features/users/hooks/use-follow-user"
import { useAuthStore } from "@/shared/stores/auth-store"
import { PostCard } from "@/features/posts/components/post-card"
import type { ProfileUser, ProfileChild } from "../types/profile-types"
import { useChildren } from "@/features/children/hooks/use-children"
import { ChildAddModal } from "./child-add-modal"

interface ProfileContentProps {
  userId: string
}

export function ProfileContent({ userId }: ProfileContentProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [isChildAddModalOpen, setIsChildAddModalOpen] = useState(false)
  
  const { user: currentUser } = useAuthStore()
  const { profile, isLoading } = useProfile(userId)
  const { stats } = useProfileStats(userId)
  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage } = useUserPosts(userId)
  const { follow, unfollow, isFollowing, isUnfollowing } = useFollowUser()
  const { data: userChildren, refetch: refetchChildren } = useChildren(userId)

  const isOwnProfile = currentUser?.id === userId

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">프로필을 찾을 수 없습니다.</p>
      </div>
    )
  }

  const handleFollow = () => {
    if (currentUser && profile) {
      follow(currentUser.id)
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* 프로필 헤더 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="relative inline-block">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={profile.avatar || "/placeholder.svg?height=96&width=96"} />
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl">
                {profile.nickname[0]}
              </AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <h1 className="text-xl font-bold">{profile.nickname}</h1>
          {profile.bio && (
            <p className="text-gray-600 text-sm mt-1">{profile.bio}</p>
          )}
          <p className="text-gray-600 text-sm">
            {profile.location} • 가입일: {new Date(profile.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' })}
          </p>
          <div className="flex justify-center items-center space-x-2 mt-2">
            <Badge className={profile.verified ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gray-400"}>
              {profile.verified ? "인증 회원" : "일반 회원"}
            </Badge>
            {isOwnProfile ? (
              <Button variant="ghost" size="sm" onClick={() => setShowSettingsModal(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant={profile.isFollowing ? "outline" : "default"} 
                size="sm"
                onClick={handleFollow}
                disabled={isFollowing}
              >
                {profile.isFollowing ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-1" />
                    언팔로우
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    팔로우
                  </>
                )}
              </Button>
            )}
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
              <TabsTrigger value="posts">게시글 ({posts.length})</TabsTrigger>
              <TabsTrigger value="children">아이 정보</TabsTrigger>
              <TabsTrigger value="interests">관심사</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4 mt-4">
              {posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  {hasNextPage && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? "로딩 중..." : "더 보기"}
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">작성한 게시글이 없습니다.</p>
                  {isOwnProfile && (
                    <Button
                      className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      onClick={() => window.location.href = '/feed'}
                    >
                      첫 게시글 작성하기
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="children" className="space-y-4 mt-4">
              {userChildren && userChildren.length > 0 ? (
                <>
                  {userChildren.map((child: ProfileChild) => (
                    <Card key={child.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{child.name}</h4>
                            <p className="text-sm text-gray-600">
                              {child.age}세 • {child.gender === "male" ? "남아" : "여아"}
                            </p>
                          </div>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            child.gender === "female" ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gradient-to-r from-blue-500 to-cyan-500"
                          }`}>
                            <span className="text-white font-bold">{child.name[0]}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">등록된 아이 정보가 없습니다.</p>
                </div>
              )}
              {isOwnProfile && (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsChildAddModalOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    아이 정보 추가하기
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="interests" className="space-y-4 mt-4">
              <div className="flex flex-wrap gap-2">
                {profile.interests?.length > 0 ? (
                  profile.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <div className="text-center py-8 w-full">
                    <p className="text-gray-500">등록된 관심사가 없습니다.</p>
                    {isOwnProfile && (
                      <Button
                        className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                        onClick={() => setShowEditModal(true)}
                      >
                        관심사 추가
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {isOwnProfile && (
        <>
          <ProfileEditModal user={profile} open={showEditModal} onOpenChange={setShowEditModal} />
          <SettingsModal open={showSettingsModal} onOpenChange={setShowSettingsModal} />
          <ChildAddModal
            isOpen={isChildAddModalOpen}
            onClose={() => setIsChildAddModalOpen(false)}
            onChildAdded={() => {
              refetchChildren()
              setIsChildAddModalOpen(false)
            }}
          />
        </>
      )}
    </>
  )
}
