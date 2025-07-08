"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, ImageIcon, X } from "lucide-react"
import { useCreatePost } from "../hooks/use-posts"
import { useAuthStore } from "@/stores/auth-store"

export function CreatePostDialog() {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [ageGroup, setAgeGroup] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const { createPost, isLoading } = useCreatePost()
  const { user } = useAuthStore()

  const categories = [
    { value: "play", label: "놀이/활동" },
    { value: "health", label: "건강/안전" },
    { value: "education", label: "교육" },
    { value: "food", label: "식사" },
    { value: "products", label: "육아용품" },
    { value: "advice", label: "고민상담" },
  ]

  const ageGroups = [
    { value: "0-2", label: "영아 (0-2세)" },
    { value: "3-5", label: "유아 (3-5세)" },
    { value: "6-8", label: "초등 저학년 (6-8세)" },
    { value: "9-12", label: "초등 고학년 (9-12세)" },
    { value: "all", label: "전체 연령" },
  ]

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!user) return

    try {
      await createPost({
        content,
        category,
        ageGroup,
        tags,
        authorId: user.id,
      })

      setOpen(false)
      // Reset form
      setContent("")
      setCategory("")
      setAgeGroup("")
      setTags([])
    } catch (error) {
      // Error is handled in the hook
    }
  }

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
            <Textarea
              placeholder="어떤 이야기를 나누고 싶으신가요?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">카테고리</label>
              <Select value={category} onValueChange={setCategory}>
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
              <label className="text-sm font-medium mb-2 block">연령대</label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
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
            <label className="text-sm font-medium mb-2 block">태그</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="태그 입력 후 Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button type="button" onClick={addTag} size="sm">
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
          </div>

          <Button variant="outline" className="w-full border-dashed bg-transparent">
            <ImageIcon className="h-4 w-4 mr-2" />
            사진 추가
          </Button>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
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
