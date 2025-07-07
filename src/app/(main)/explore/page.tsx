"use client"

import { motion } from "framer-motion"
import { Search, TrendingUp, Users, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ExplorePage() {
  const trendingTags = [
    "신생아케어",
    "유아놀이",
    "초등교육",
    "편식해결",
    "수면교육",
    "장난감추천",
    "책추천",
    "외출준비",
    "안전용품",
    "성장발달",
  ]

  const popularGroups = [
    { name: "서울 강남구 엄마들", members: 1234, category: "지역" },
    { name: "홈스쿨링 모임", members: 856, category: "교육" },
    { name: "워킹맘 소통방", members: 2341, category: "라이프" },
    { name: "신생아 육아 정보", members: 1876, category: "연령별" },
  ]

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input placeholder="관심있는 주제를 검색해보세요" className="pl-10" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-pink-500" />
              인기 태그
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge variant="secondary" className="cursor-pointer hover:bg-pink-100 hover:text-pink-700">
                    #{tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-purple-500" />
              인기 그룹
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularGroups.map((group, index) => (
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-green-500" />
              이번 주 이벤트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50">
              <h3 className="font-medium text-sm">온라인 육아 세미나</h3>
              <p className="text-xs text-gray-600 mt-1">소아과 전문의와 함께하는 신생아 케어</p>
              <p className="text-xs text-pink-600 mt-2">1월 20일 오후 2시</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
              <h3 className="font-medium text-sm">강남구 엄마 모임</h3>
              <p className="text-xs text-gray-600 mt-1">카페에서 만나는 오프라인 모임</p>
              <p className="text-xs text-blue-600 mt-2">1월 22일 오전 10시</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
