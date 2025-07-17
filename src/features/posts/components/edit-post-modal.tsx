"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Upload, Loader2 } from "lucide-react"
import { Post } from "../types/post-type"
import { useEditPost } from "../hooks/use-edit-post"
import { getCategoryLabel, getAgeGroupLabel, CATEGORIES, AGE_GROUPS, MAX_TAGS_PER_POST, MAX_IMAGES_PER_POST } from "@/shared/constants/common-data"

interface EditPostModalProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPostModal({ post, open, onOpenChange }: EditPostModalProps) {
  const {
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
    isLoading,
  } = useEditPost(post, onOpenChange)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-left">게시글 수정</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">내용</label>
            <Textarea
              placeholder="어떤 이야기를 나누고 싶으신가요?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {content.length}/1000
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">카테고리</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
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
                  {AGE_GROUPS.map((age) => (
                    <SelectItem key={age.value} value={age.value}>
                      {age.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">이미지 ({images.length}/{MAX_IMAGES_PER_POST})</label>
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => document.getElementById('edit-image-upload')?.click()}
              disabled={images.length >= MAX_IMAGES_PER_POST}
            >
              <Upload className="h-4 w-4 mr-2" />
              이미지 업로드
            </Button>
            <input
              id="edit-image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
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
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!content.trim() || !category || !ageGroup || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  수정 중...
                </>
              ) : (
                "수정하기"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}