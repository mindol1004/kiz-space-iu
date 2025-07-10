
"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES, AGE_GROUPS, MAX_TAGS_PER_POST, MAX_IMAGES_PER_POST, MESSAGES } from "@/shared/constants/common-data"
import { CreatePostData } from "../types/post-type"

export function useCreatePostDialog() {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<string>("")
  const [ageGroup, setAgeGroup] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [images, setImages] = useState<string[]>([])

  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const { toast } = useToast()

  const createPostMutation = useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "게시글 작성 완료",
        description: MESSAGES.POST_CREATED,
      })
    },
    onError: () => {
      toast({
        title: "게시글 작성 실패",
        description: MESSAGES.POST_FAILED,
        variant: "destructive",
      })
    },
  })

  const categories = CATEGORIES
  const ageGroups = AGE_GROUPS.filter(group => group.value !== "ALL")

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < MAX_TAGS_PER_POST) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    } else if (tags.length >= MAX_TAGS_PER_POST) {
      toast({
        title: "태그 제한",
        description: "태그는 최대 5개까지 추가할 수 있습니다.",
        variant: "destructive"
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file, index) => 
        `/placeholder.svg?${Date.now()}-${index}`
      )
      setImages(prev => [...prev, ...newImages].slice(0, MAX_IMAGES_PER_POST))
    }
  }

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove))
  }

  const resetForm = () => {
    setContent("")
    setCategory("")
    setAgeGroup("")
    setTags([])
    setTagInput("")
    setImages([])
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "로그인 필요",
        description: "게시글을 작성하려면 로그인이 필요합니다.",
        variant: "destructive"
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "내용 입력 필요",
        description: "게시글 내용을 입력해주세요.",
        variant: "destructive"
      })
      return
    }

    if (!category || !ageGroup || category === "" || ageGroup === "") {
      toast({
        title: "필수 정보 누락",
        description: "카테고리와 연령대를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      await createPostMutation.mutateAsync({
        content: content.trim(),
        category: category as any,
        ageGroup: ageGroup as any,
        tags,
        authorId: user.id,
        images,
      })

      setOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to create post:", error)
    }
  }

  return {
    open,
    setOpen,
    content,
    setContent,
    category,
    setCategory,
    ageGroup,
    setAgeGroup,
    tags,
    setTags,
    tagInput,
    setTagInput,
    images,
    setImages,
    categories,
    ageGroups,
    addTag,
    removeTag,
    handleImageUpload,
    removeImage,
    resetForm,
    handleSubmit,
    isLoading: createPostMutation.isPending,
  }
}
