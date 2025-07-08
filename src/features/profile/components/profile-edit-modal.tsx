"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Camera, X } from "lucide-react"
import { REGIONS, INTEREST_TAGS } from "@/features/auth/data/signup-data"
import { useToast } from "@/hooks/use-toast"

interface ProfileEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    nickname: string
    email: string
    region: string
    bio?: string
    avatar?: string
    interests: string[]
  }
}

export function ProfileEditModal({ open, onOpenChange, user }: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    nickname: user.nickname,
    region: user.region,
    bio: user.bio || "",
    interests: user.interests,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "프로필 수정 완료",
        description: "프로필이 성공적으로 수정되었습니다.",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "수정 실패",
        description: "프로필 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl">
                  {user.nickname[0]}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">프로필 사진 변경</p>
          </div>

          {/* 기본 정보 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
                placeholder="닉네임을 입력하세요"
              />
            </div>

            <div>
              <Label htmlFor="email">이메일</Label>
              <Input id="email" value={user.email} disabled className="bg-gray-50" />
              <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
            </div>

            <div>
              <Label htmlFor="region">지역</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
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

            <div>
              <Label htmlFor="bio">소개</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="자신을 소개해주세요"
                rows={3}
              />
            </div>
          </div>

          {/* 관심사 */}
          <div>
            <Label>관심사 ({formData.interests.length}/10)</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {INTEREST_TAGS.map((interest) => (
                <motion.div key={interest} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Badge
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    className={`cursor-pointer w-full justify-center py-2 ${
                      formData.interests.includes(interest)
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                        : ""
                    }`}
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                    {formData.interests.includes(interest) && <X className="h-3 w-3 ml-1" />}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              취소
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !formData.nickname.trim()}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {isLoading ? "저장 중..." : "저장"}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
