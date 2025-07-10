"use client"

import { useState, useMemo } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { PostsAPI } from "../api/post-api"
import { CreatePostData } from "../types/post-type"
import { CATEGORIES, AGE_GROUPS, MESSAGES } from "@/shared/constants/common-data"

export function useCreatePostDialog() {
  const [open, setOpen] = useState<boolean>(false)
  const [content, setContent] = useState<string>("")
  const [images, setImages] = useState<string[]>([])
  const [category, setCategory] = useState<string>("")
  const [ageGroup, setAgeGroup] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")

  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostData) => PostsAPI.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      handleClose()
    },
    onError: (error) => {
      console.error("게시글 작성 실패:", error)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert(MESSAGES.LOGIN_REQUIRED)
      return
    }

    if (!content.trim()) {
      alert(MESSAGES.CONTENT_REQUIRED)
      return
    }

    if (!category) {
      alert(MESSAGES.CATEGORY_REQUIRED)
      return
    }

    if (!ageGroup) {
      alert(MESSAGES.AGE_GROUP_REQUIRED)
      return
    }

    const postData: CreatePostData = {
      content: content.trim(),
      images,
      category,
      ageGroup,
      tags,
      authorId: user.id,
    }

    createPostMutation.mutate(postData)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => URL.createObjectURL(file))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags(prev => [...prev, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleClose = () => {
    setOpen(false)
    setContent("")
    setImages([])
    setCategory("")
    setAgeGroup("")
    setTags([])
    setCurrentTag("")
  }

  const categories = useMemo(() => CATEGORIES, [])
  const ageGroups = useMemo(() => AGE_GROUPS, [])

  return {
    open,
    setOpen,
    content,
    setContent,
    images,
    setImages,
    category,
    setCategory,
    ageGroup,
    setAgeGroup,
    tags,
    setTags,
    currentTag,
    setCurrentTag,
    handleSubmit,
    handleImageUpload,
    removeImage,
    addTag,
    removeTag,
    handleClose,
    isLoading: createPostMutation.isPending,
    categories: categories,
    ageGroups: ageGroups,
  }
}