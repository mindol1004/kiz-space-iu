"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, ImageIcon, X, Upload } from "lucide-react"
import { useCreatePost } from "../hooks/use-posts"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES, AGE_GROUPS, MAX_TAGS_PER_POST, MAX_IMAGES_PER_POST } from "@/shared/constants/common-data"
import { PostCategory, AgeGroup } from "../types/post-type" // Importing the new types
import { POST_CATEGORIES, AGE_GROUPS as AGE_GROUP_CONSTANTS } from "@/shared/constants/common-data";

export function CreatePostDialog() {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<PostCategory | "">("")
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "">("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [images, setImages] = useState<string[]>([])
  const { mutateAsync: createPost, isPending: isLoading } = useCreatePost()
  const { user } = useAuthStore()
  const { toast } = useToast()

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
      // 실제 구현에서는 파일을 서버에 업로드하고 URL을 받아와야 합니다
      // 현재는 더미 URL을 사용
      const newImages = Array.from(files).map((file, index) => 
        `/placeholder.svg?${Date.now()}-${index}`
      )
      setImages(prev => [...prev, ...newImages].slice(0, MAX_IMAGES_PER_POST)) // 최대 4개 이미지
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

    if (!category) {
      toast({
        title: "카테고리 선택 필요",
        description: "카테고리를 선택해주세요.",
        variant: "destructive"
      })
      return
    }

    if (!ageGroup) {
      toast({
        title: "연령대 선택 필요",
        description: "연령대를 선택해주세요.",
        variant: "destructive"
      })
      return
    }

    try {
      await createPost({
        content: content.trim(),
        category: category as PostCategory,
        ageGroup: ageGroup as AgeGroup,
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

  const categories = Object.entries(POST_CATEGORIES)
    .filter(([key]) => key !== "PREGNANCY") // 임신 카테고리 제외
    .map(([key, label]) => ({
      value: key,
      label
    }))

  const ageGroups = Object.entries(AGE_GROUP_CONSTANTS)
    .filter(([key]) => key !== "PREGNANCY") // 임신 연령대 제외
    .map(([key, label]) => ({
      value: key,
      label
    }))


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
          <Plus className="h-4 w-4 mr-2" />새 글 작성
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 글 작성</DialogTitle>
        </DialogHeader>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">내용 *</label>
            <Textarea
              placeholder="어떤 이야기를 나누고 싶으신가요?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {content.length}/1000
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">카테고리 *</label>
              <Select value={category} onValueChange={(value) => setCategory(value as PostCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">연령대 *</label>
              <Select value={ageGroup} onValueChange={(value) => setAgeGroup(value as AgeGroup)}>
                <SelectTrigger>
                  <SelectValue placeholder="연령대 선택" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map((age) => (
                    <SelectItem key={age.value} value={age.value}>
                      {age.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">태그 (선택사항)</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="태그 입력 후 Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
                className="flex-1"
                maxLength={20}
              />
              <Button type="button" onClick={addTag} size="sm" disabled={tags.length >= MAX_TAGS_PER_POST}>
                추가
              </Button>
            </div>
            <AnimatePresence>
              {tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      #{tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="text-xs text-gray-500 mt-1">
              {tags.length}/{MAX_TAGS_PER_POST} 태그
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">사진 (선택사항)</label>
            <div className="space-y-2">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={images.length >= MAX_IMAGES_PER_POST}
              />
              <label htmlFor="image-upload">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-dashed bg-transparent cursor-pointer"
                  disabled={images.length >= MAX_IMAGES_PER_POST}
                  asChild
                >
                  <div>
                    <Upload className="h-4 w-4 mr-2" />
                    사진 추가 ({images.length}/{MAX_IMAGES_PER_POST})
                  </div>
                </Button>
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={image} alt={`업로드된 이미지 ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setOpen(false)
                resetForm()
              }} 
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || !category || !ageGroup || isLoading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {isLoading ? "게시 중..." : "게시하기"}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}