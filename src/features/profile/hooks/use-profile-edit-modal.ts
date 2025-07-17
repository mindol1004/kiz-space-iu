
"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form" // Corrected import
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useProfile } from "../hooks/use-profile"
import { ProfileAPI } from "../api/profile-api"
import type { UserProfile } from "../types/profile-types"

const profileSchema = z.object({
  nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다").max(20, "닉네임은 20자 이하여야 합니다"),
  bio: z.string().max(200, "자기소개는 200자 이하여야 합니다").optional(),
  location: z.string().max(50, "지역은 50자 이하여야 합니다").optional(),
})

interface UseProfileEditModalProps {
  user: UserProfile
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function useProfileEditModal({ user, open, onOpenChange }: UseProfileEditModalProps) {
  const [interests, setInterests] = useState<string[]>([])
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { updateProfile, isUpdating } = useProfile(user.id)
  const { toast } = useToast()

  // Ref to store the interests that were *last set* by this useEffect for this user
  const lastAppliedInterestsRef = useRef<string[] | undefined>(undefined);

  // Initialize interests state when modal opens or user changes
  useEffect(() => {
    if (open) {
      // Ensure user.interests is an array before trying to sort it
      const currentPropInterests = user.interests ? [...user.interests] : [];
      const currentPropInterestsSorted = currentPropInterests.sort();

      // Get the last applied interests and sort them for comparison
      const lastAppliedInterestsSorted = lastAppliedInterestsRef.current ? [...lastAppliedInterestsRef.current].sort() : [];

      // Only update if the content of user.interests has actually changed
      if (JSON.stringify(currentPropInterestsSorted) !== JSON.stringify(lastAppliedInterestsSorted)) {
        setInterests([...currentPropInterests]); // Set the unsorted array
        lastAppliedInterestsRef.current = [...currentPropInterests]; // Store a copy for future comparison
      }
    } else {
      // When modal closes, reset the state and ref for a clean slate on next open
      setInterests([]);
      lastAppliedInterestsRef.current = undefined;
    }
  }, [open, user.id, user.interests]);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: user.nickname,
      bio: user.bio || "",
      location: user.location || "",
    },
  })

  // Reset form values when modal opens or user changes
  useEffect(() => {
    if (open) {
      form.reset({
        nickname: user.nickname,
        bio: user.bio || "",
        location: user.location || "",
      })
      setAvatarFile(null)
      setAvatarPreview(null)
    }
  }, [open, user, form])

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      // Handle avatar upload first
      let avatarUrl = user.avatar
      if (avatarFile) {
        setIsUploadingAvatar(true)
        const result = await ProfileAPI.uploadAvatar(user.id, avatarFile)
        avatarUrl = result.avatarUrl
        setIsUploadingAvatar(false)
      }

      // Update profile
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

  const toggleInterest = useCallback((interest: string) => {
    setInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest)
      } else {
        return [...prev, interest]
      }
    })
  }, [])

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // File size check (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "파일 크기 초과",
          description: "이미지는 5MB 이하여야 합니다.",
          variant: "destructive",
        })
        return
      }

      // File type check
      if (!file.type.startsWith('image/')) {
        toast({
          title: "잘못된 파일 형식",
          description: "이미지 파일만 업로드 가능합니다.",
          variant: "destructive",
        })
        return
      }

      setAvatarFile(file)
      
      // Generate preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [toast])

  return {
    form,
    interests,
    toggleInterest,
    avatarPreview,
    fileInputRef,
    handleAvatarChange,
    onSubmit,
    isUpdating,
    isUploadingAvatar,
  }
}
