"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, X, Upload, Pencil } from "lucide-react"
import { useCreatePostDialog } from "../hooks/use-create-post-dialog"
import { MAX_TAGS_PER_POST, MAX_IMAGES_PER_POST } from "@/shared/constants/common-data"

export function CreatePostDialog() {
  const {
    open,
    setOpen,
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
    categories,
    ageGroups,
    addTag,
    removeTag,
    handleImageUpload,
    removeImage,
    resetForm,
    handleSubmit,
    isLoading,
  } = useCreatePostDialog()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="icon"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Pencil className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-left">새 글 작성</DialogTitle>
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
              <Select value={category} onValueChange={(value) => setCategory(value)}>
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
              <Select value={ageGroup} onValueChange={(value) => setAgeGroup(value)}>
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