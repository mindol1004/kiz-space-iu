
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateChild } from "@/features/children/hooks/use-children"
import { useAuthStore } from "@/shared/stores/auth-store"
import { AGE_GROUPS } from "@/shared/constants/common-data"
import type { Child } from "@/features/auth/types/auth-types"

interface ChildAddModalProps {
  isOpen: boolean
  onClose: () => void
  onChildAdded: () => void
}

export function ChildAddModal({ isOpen, onClose, onChildAdded }: ChildAddModalProps) {
  const { user } = useAuthStore()
  const createChildMutation = useCreateChild()

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    birthDate: "",
    gender: "" as "boy" | "girl" | ""
  })

  const handleInputChange = (name: string, value: string | "boy" | "girl") => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!formData.name || !formData.age || !formData.gender || !user?.id) {
        return
      }

      await createChildMutation.mutateAsync({
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        parentId: user.id,
        birthDate: formData.birthDate || undefined,
      })

      setFormData({
        name: "",
        age: "",
        birthDate: "",
        gender: "" as "boy" | "girl" | ""
      })
      onChildAdded()
      onClose()
    } catch (error) {
      console.error("Failed to add child:", error)
    }
  }

  const handleModalClose = () => {
    onClose()
    setFormData({
      name: "",
      age: "",
      birthDate: "",
      gender: "" as "boy" | "girl" | ""
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>아이 정보 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {createChildMutation.error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {createChildMutation.error.message}
              </div>
            )}

            <p className="text-sm text-gray-600">
              자녀 정보를 등록하면 연령대에 맞는 콘텐츠를 추천받을 수 있어요.
            </p>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>이름</Label>
                      <Input
                        placeholder="자녀 이름"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label>나이</Label>
                      <Input
                        type="number"
                        placeholder="나이"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>생년월일</Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>성별</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => handleInputChange("gender", value as "boy" | "girl")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="성별 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="boy">남자</SelectItem>
                        <SelectItem value="girl">여자</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleModalClose}>
                취소
              </Button>
              <Button 
                type="submit"
                disabled={createChildMutation.isPending || !formData.name || !formData.age || !formData.gender}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {createChildMutation.isPending ? "추가 중..." : "추가하기"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
