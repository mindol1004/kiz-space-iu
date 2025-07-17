"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useAuthStore } from "@/shared/stores/auth-store"
import { useChildAddModal } from "@/features/children/hooks/use-child-add-modal"

interface ChildAddModalProps {
  onSuccess?: () => void
}

export function ChildAddModal({ onSuccess }: ChildAddModalProps) {
  const { user } = useAuthStore()

  const {
    isOpen,
    formData,
    isLoading,
    openModal,
    closeModal,
    handleInputChange,
    handleSubmit,
  } = useChildAddModal({
    parentId: user?.id || "",
    onSuccess,
  })

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => open ? openModal() : closeModal()}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-none"
        >
          <Plus className="h-4 w-4 mr-2" />
          아이 정보 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>아이 정보 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="아이의 이름을 입력하세요"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">나이</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              placeholder="나이를 입력하세요"
              min="0"
              max="18"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">성별</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="성별을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boy">남아</SelectItem>
                <SelectItem value="girl">여아</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">생년월일 (선택사항)</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.name || !formData.age || !formData.gender}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {isLoading ? "추가 중..." : "추가"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}