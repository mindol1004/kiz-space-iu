"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Clock, TrendingUp, Hash, User, FileText } from "lucide-react"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "posts" | "users" | "tags">("all")

  const recentSearches = ["신생아 수면", "이유식 시작", "육아용품 추천", "예방접종 일정"]

  const trendingTags = ["#신생아케어", "#이유식", "#육아용품", "#수면교육", "#예방접종"]

  const searchResults = {
    posts: [
      {
        id: "1",
        title: "신생아 수면 패턴에 대해 질문드려요",
        author: "김엄마",
        content: "우리 아기가 밤에 자주 깨는데...",
        likes: 12,
        comments: 8,
      },
      {
        id: "2",
        title: "이유식 시작 시기와 방법",
        author: "이엄마",
        content: "6개월부터 시작하는 이유식...",
        likes: 24,
        comments: 15,
      },
    ],
    users: [
      {
        id: "1",
        nickname: "김엄마",
        bio: "2세 아들 엄마입니다",
        avatar: "/placeholder.svg",
        followers: 156,
      },
      {
        id: "2",
        nickname: "이엄마",
        bio: "신생아 케어 전문가",
        avatar: "/placeholder.svg",
        followers: 324,
      },
    ],
    tags: [
      { name: "#신생아케어", count: 1234 },
      { name: "#이유식", count: 856 },
      { name: "#수면교육", count: 642 },
    ],
  }

  const tabs = [
    { id: "all", label: "전체", icon: Search },
    { id: "posts", label: "게시글", icon: FileText },
    { id: "users", label: "사용자", icon: User },
    { id: "tags", label: "태그", icon: Hash },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 rounded-lg">
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요..."
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="flex space-x-1 mt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                      : ""
                  }
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {tab.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!query ? (
            <div className="space-y-6">
              {/* 최근 검색 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <h3 className="font-medium">최근 검색</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <Badge
                      key={search}
                      variant="secondary"
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => setQuery(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 인기 태그 */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <h3 className="font-medium">인기 태그</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-pink-50 hover:border-pink-300"
                      onClick={() => setQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {(activeTab === "all" || activeTab === "posts") && (
                  <motion.div
                    key="posts"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="font-medium mb-3">게시글</h3>
                    <div className="space-y-3">
                      {searchResults.posts.map((post) => (
                        <div key={post.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <h4 className="font-medium">{post.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">{post.author}</span>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <span>좋아요 {post.likes}</span>
                              <span>댓글 {post.comments}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {(activeTab === "all" || activeTab === "users") && (
                  <motion.div
                    key="users"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="font-medium mb-3">사용자</h3>
                    <div className="space-y-3">
                      {searchResults.users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                              {user.nickname[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{user.nickname}</h4>
                            <p className="text-sm text-gray-600">{user.bio}</p>
                          </div>
                          <div className="text-sm text-gray-500">팔로워 {user.followers}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {(activeTab === "all" || activeTab === "tags") && (
                  <motion.div
                    key="tags"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="font-medium mb-3">태그</h3>
                    <div className="space-y-2">
                      {searchResults.tags.map((tag) => (
                        <div
                          key={tag.name}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <span className="font-medium text-pink-600">{tag.name}</span>
                          <span className="text-sm text-gray-500">{tag.count.toLocaleString()} 게시글</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}