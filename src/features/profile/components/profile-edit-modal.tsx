"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/schemas"

interface ProfileEditModalProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

const INTEREST_TAGS = [
  "신생아케어",
  "유아놀이",
  "초등교육",
  "편식해결",
  "수면교육",
  "언어발달",
  "감정코칭",
  "창의놀이",
  "홈스쿨링",
  "영어교육",
  "수학교육",
  "독서교육",
  "체육활동",
  "음악교육",
  "미술활동",
  "요리활동",
]

const REGIONS = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
]

export function ProfileEditModal({ user, open, onOpenChange }: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    nickname: user.nickname,
    bio: user.bio || "",
    location: user.location,
    interests: user.interests || [],
  })
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests || [])
  const { toast } = useToast()

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest)
      } else if (prev.length < 10) {
        return [...prev, interest]
      }
      return prev
    })
  }

  const handleSave = () => {
    // 실제로는 API 호출
    toast({
      title: "프로필 수정 완료",
      description: "프로필이 성공적으로 수정되었습니다.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 프로필 이미지 */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl">
                  {user.nickname[0]}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" className="absolute -bottom-1 -right-1 rounded-full h-8 w-8 p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="닉네임을 입력하세요"
              />
            </div>

            <div>
              <Label htmlFor="bio">소개</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="자기소개를 입력하세요"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location">지역</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="지역을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 관심사 */}
          <div>
            <Label>관심사 (최대 10개)</Label>
            <p className="text-sm text-gray-500 mb-3">선택된 관심사: {selectedInterests.length}/10</p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_TAGS.map((interest) => {
                const isSelected = selectedInterests.includes(interest)
                return (
                  <Badge
                    key={interest}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                    {isSelected && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              저장
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
