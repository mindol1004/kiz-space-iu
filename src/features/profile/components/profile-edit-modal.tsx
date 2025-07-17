
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
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Plus, Upload, User, MapPin, Heart, Camera, Loader2 } from "lucide-react"
import { useProfile } from "../hooks/use-profile"
import { ProfileAPI } from "../api/profile-api"
import { useToast } from "@/hooks/use-toast"
import { REGIONS } from "@/shared/constants/common-data"
import type { UserProfile } from "../types/profile-types"

const profileSchema = z.object({
  nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다").max(20, "닉네임은 20자 이하여야 합니다"),
  bio: z.string().max(200, "소개는 200자 이하여야 합니다").optional(),
  location: z.string().max(50, "지역은 50자 이하여야 합니다").optional(),
})

interface ProfileEditModalProps {
  user: UserProfile
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileEditModal({ user, open, onOpenChange }: ProfileEditModalProps) {
  const [interests, setInterests] = useState<string[]>(user.interests || [])
  const [newInterest, setNewInterest] = useState("")
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

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim()) && interests.length < 10) {
      setInterests([...interests, newInterest.trim()])
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest))
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

      // 이미지 파일 체크
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
      <DialogContent className="max-w-md w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-gray-900">프로필 편집</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* 프로필 이미지 섹션 */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={avatarPreview || user.avatar || "/placeholder.svg?height=96&width=96"} />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl">
                  {user.nickname[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">클릭하여 프로필 사진 변경</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* 닉네임 */}
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>닉네임</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input {...field} placeholder="닉네임을 입력하세요" className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 지역 */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>지역</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <SelectValue placeholder="거주 지역을 선택해주세요" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {REGIONS.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 자기소개 */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>자기소개</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="간단한 자기소개를 작성해주세요"
                        rows={3}
                        className="resize-none"
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
              <div className="space-y-3">
                <FormLabel className="flex items-center">
                  <Heart className="h-4 w-4 text-pink-500 mr-2" />
                  관심사
                </FormLabel>
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="관심사 추가"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addInterest}
                    disabled={!newInterest.trim() || interests.length >= 10}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <AnimatePresence>
                  {interests.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2"
                    >
                      {interests.map((interest, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Badge variant="secondary" className="text-sm bg-pink-50 text-pink-700 border-pink-200">
                            {interest}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-2 hover:bg-transparent"
                              onClick={() => removeInterest(interest)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <p className="text-xs text-gray-500">
                  {interests.length}/10개의 관심사를 등록할 수 있습니다.
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  disabled={isUpdating || isUploadingAvatar}
                >
                  {isUpdating || isUploadingAvatar ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {isUploadingAvatar ? "업로드 중..." : "저장 중..."}
                    </>
                  ) : (
                    "저장"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
