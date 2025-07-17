"use client"

import { useRef, useCallback, useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Camera, User, MapPin, Heart, Loader2 } from "lucide-react"
import { INTEREST_TAGS, REGIONS } from "@/shared/constants/common-data"
import type { UserProfile } from "../types/profile-types"
import { useProfileEditModal } from "../hooks/use-profile-edit-modal"

interface ProfileEditModalProps {
  user: UserProfile
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileEditModal({ user, open, onOpenChange }: ProfileEditModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [localInterests, setLocalInterests] = useState<string[]>([])

  const {
    form,
    avatarPreview,
    handleAvatarChange,
    onSubmit,
    isUpdating,
    isUploadingAvatar,
  } = useProfileEditModal({ user, open, onOpenChange })

  const isLoading = useMemo(() => isUpdating || isUploadingAvatar, [isUpdating, isUploadingAvatar])

  useEffect(() => {
    if (open && user.interests) {
      setLocalInterests(user.interests)
    }
  }, [open, user.interests])

  const handleCameraClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const handleFormSubmit = useCallback((data: any) => {
    const formDataWithInterests = {
      ...data,
      interests: localInterests
    }
    onSubmit(formDataWithInterests)
  }, [onSubmit, localInterests])

  const handleToggleInterest = useCallback((interest: string) => {
    if (isLoading) return

    setLocalInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }, [isLoading])

  const interestItems = useMemo(() => {
    return INTEREST_TAGS.map((interest) => {
      const isSelected = localInterests.includes(interest)
      return {
        interest,
        isSelected,
        key: interest
      }
    })
  }, [localInterests])

  const selectedInterestsBadges = useMemo(() => {
    if (localInterests.length === 0) return null

    return (
      <div className="mt-4">
        <p className="text-sm font-medium mb-2">선택된 관심사:</p>
        <div className="flex flex-wrap gap-2">
          {localInterests.map((interest) => (
            <Badge
              key={interest}
              variant="secondary"
              className="bg-pink-50 text-pink-700 border-pink-200"
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>
    )
  }, [localInterests])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">프로필 편집</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                  onClick={handleCameraClick}
                  disabled={isLoading}
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
              <p className="text-sm text-gray-500">프로필 사진 변경 (5MB 이하)</p>
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
                      disabled={isLoading}
                    />
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
                  <FormLabel className="flex items-center">
                    <MapPin className="h-4 w-4 text-pink-500 mr-2" />
                    지역
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:border-pink-500 focus:ring-pink-500">
                        <SelectValue placeholder="거주 지역을 선택해주세요" />
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
                      disabled={isLoading}
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
                {interestItems.map(({ interest, isSelected, key }) => (
                  <div
                    key={key}
                    className={`p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? "bg-pink-50 border-pink-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    } ${isLoading ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleInterest(interest)}
                        disabled={isLoading}
                      />
                      <span className="text-sm">{interest}</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedInterestsBadges}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isLoading ? (
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
