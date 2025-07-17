
"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useProfile } from "../hooks/use-profile"
import { ProfileAPI } from "../api/profile-api"
import { Camera, User, MapPin, Heart, Loader2 } from "lucide-react"
import { INTEREST_TAGS, REGIONS } from "@/shared/constants/common-data"
import type { UserProfile } from "../types/profile-types"

const profileSchema = z.object({
  nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다").max(20, "닉네임은 20자 이하여야 합니다"),
  bio: z.string().max(200, "자기소개는 200자 이하여야 합니다").optional(),
  location: z.string().max(50, "지역은 50자 이하여야 합니다").optional(),
})

interface ProfileEditModalProps {
  user: UserProfile
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileEditModal({ user, open, onOpenChange }: ProfileEditModalProps) {
  const [interests, setInterests] = useState<string[]>(user.interests || [])
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { updateProfile, isUpdating } = useProfile(user.id)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: user.nickname,
      bio: user.bio || "",
      location: user.location || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      // 아바타 업로드 먼저 처리
      let avatarUrl = user.avatar
      if (avatarFile) {
        setIsUploadingAvatar(true)
        const result = await ProfileAPI.uploadAvatar(user.id, avatarFile)
        avatarUrl = result.avatarUrl
        setIsUploadingAvatar(false)
      }

      // 프로필 업데이트
      await updateProfile({
        ...values,
        interests,
        avatar: avatarUrl,
      })
      
      onOpenChange(false)
      toast({
        title: "프로필이 업데이트되었습니다",
        description: "변경사항이 저장되었습니다.",
      })
    } catch (error) {
      setIsUploadingAvatar(false)
      toast({
        title: "프로필 업데이트 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      })
    }
  }

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "파일 크기 초과",
          description: "이미지는 5MB 이하여야 합니다.",
          variant: "destructive",
        })
        return
      }

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        toast({
          title: "잘못된 파일 형식",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive",
        })
        return
      }

      setAvatarFile(file)
      
      // 미리보기 생성
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            프로필 편집
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 프로필 사진 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage 
                    src={avatarPreview || user.avatar || "/placeholder-user.jpg"} 
                    alt={user.nickname}
                  />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    {user.nickname[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white border-2 hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500">
                프로필 사진 변경 (5MB 이하)
              </p>
            </div>

            {/* 닉네임 */}
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <User className="h-4 w-4 text-pink-500 mr-2" />
                    닉네임
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="닉네임을 입력하세요"
                      className="focus:border-pink-500 focus:ring-pink-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 지역 */}
            <div className="space-y-2">
              <Label className="flex items-center">
                <MapPin className="h-4 w-4 text-pink-500 mr-2" />
                지역
              </Label>
              <Select 
                value={form.watch("location")} 
                onValueChange={(value) => form.setValue("location", value)}
              >
                <SelectTrigger className="focus:border-pink-500 focus:ring-pink-500">
                  <SelectValue placeholder="거주 지역을 선택해주세요" />
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

            {/* 자기소개 */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Heart className="h-4 w-4 text-pink-500 mr-2" />
                    자기소개
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="간단한 자기소개를 작성해주세요"
                      rows={3}
                      className="resize-none focus:border-pink-500 focus:ring-pink-500"
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500 text-right">
                    {field.value?.length || 0}/200
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 관심사 */}
            <div className="space-y-4">
              <Label className="flex items-center">
                <Heart className="h-4 w-4 text-pink-500 mr-2" />
                관심사
              </Label>
              <p className="text-sm text-gray-600">
                관심 있는 주제를 선택하면 맞춤 콘텐츠를 추천받을 수 있어요.
              </p>

              <div className="grid grid-cols-2 gap-2">
                {INTEREST_TAGS.map((interest) => (
                  <div
                    key={interest}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      interests.includes(interest)
                        ? "bg-pink-50 border-pink-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={interests.includes(interest)}
                        readOnly
                      />
                      <span className="text-sm">{interest}</span>
                    </div>
                  </div>
                ))}
              </div>

              {interests.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">선택된 관심사:</p>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge key={interest} variant="secondary" className="bg-pink-50 text-pink-700 border-pink-200">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating || isUploadingAvatar}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isUpdating || isUploadingAvatar}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isUpdating || isUploadingAvatar ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isUploadingAvatar ? "업로드 중..." : "저장 중..."}
                  </>
                ) : (
                  "저장하기"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
