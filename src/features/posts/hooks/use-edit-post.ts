
import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PostsAPI } from "../api/post-api"
import { Post } from "../types/post-type"

export function useEditPost(post: Post, onClose: (open: boolean) => void) {
  const [content, setContent] = useState(post.content)
  const [category, setCategory] = useState(post.category)
  const [ageGroup, setAgeGroup] = useState(post.ageGroup)
  const [tags, setTags] = useState<string[]>(post.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [images, setImages] = useState<string[]>(post.images || [])

  const queryClient = useQueryClient()

  // Reset form when post changes
  useEffect(() => {
    setContent(post.content)
    setCategory(post.category)
    setAgeGroup(post.ageGroup)
    setTags(post.tags || [])
    setImages(post.images || [])
  }, [post])

  const updateMutation = useMutation({
    mutationFn: (data: {
      content: string
      category: string
      ageGroup: string
      tags: string[]
      images: string[]
    }) => PostsAPI.updatePost(post.id, data),
    onSuccess: (updatedPost) => {
      // Update individual post cache
      queryClient.setQueryData(["post", post.id], updatedPost)
      
      // Update posts list cache
      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((p: Post) => 
                p.id === post.id ? updatedPost : p
              )
            }))
          }
        }
      )

      onClose(false)
    },
    onError: (error) => {
      console.error("게시글 수정 실패:", error)
      alert("게시글 수정에 실패했습니다.")
    }
  })

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (images.length >= 4) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        if (result) {
          setImages(prev => [...prev, result])
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() || !category || !ageGroup) {
      alert("필수 정보를 모두 입력해주세요.")
      return
    }

    updateMutation.mutate({
      content: content.trim(),
      category,
      ageGroup,
      tags,
      images,
    })
  }

  return {
    content,
    setContent,
    category,
    setCategory,
    ageGroup,
    setAgeGroup,
    tags,
    tagInput,
    setTagInput,
    images,
    addTag,
    removeTag,
    handleImageUpload,
    removeImage,
    handleSubmit,
    isLoading: updateMutation.isPending,
  }
}
