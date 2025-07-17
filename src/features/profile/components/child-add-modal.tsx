
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useChildAddModal } from "@/features/children/hooks/use-child-add-modal"
import { AGE_GROUPS } from "@/shared/constants/common-data"
import type { Child } from "@/features/auth/types/auth-types"

interface ChildAddModalProps {
  isOpen: boolean
  onClose: () => void
  onChildAdded: () => void
}

export function ChildAddModal({ isOpen, onClose, onChildAdded }: ChildAddModalProps) {
  const { addChild, isLoading, error } = useChildAddModal()
  
  const [children, setChildren] = useState<Child[]>([
    {
      id: Date.now().toString(),
      name: "",
      birthDate: "",
      gender: "",
      ageGroup: "",
      age: ""
    }
  ])

  const addChildToList = () => {
    const newChild: Child = {
      id: Date.now().toString(),
      name: "",
      birthDate: "",
      gender: "",
      ageGroup: "",
      age: ""
    }
    setChildren(prev => [...prev, newChild])
  }

  const updateChild = (id: string, field: keyof Child, value: string) => {
    setChildren(prev =>
      prev.map(child => (child.id === id ? { ...child, [field]: value } : child))
    )
  }

  const removeChild = (id: string) => {
    setChildren(prev => prev.filter(child => child.id !== id))
  }

  const handleSubmit = async () => {
    try {
      // 빈 필드가 있는 자녀는 제외하고 제출
      const validChildren = children.filter(child => 
        child.name && child.birthDate && child.gender && child.ageGroup
      )
      
      if (validChildren.length === 0) {
        return
      }

      await addChild(validChildren)
      onChildAdded()
      onClose()
      
      // 폼 초기화
      setChildren([{
        id: Date.now().toString(),
        name: "",
        birthDate: "",
        gender: "",
        ageGroup: "",
        age: ""
      }])
    } catch (error) {
      console.error("Failed to add children:", error)
    }
  }

  const handleClose = () => {
    onClose()
    // 폼 초기화
    setChildren([{
      id: Date.now().toString(),
      name: "",
      birthDate: "",
      gender: "",
      ageGroup: "",
      age: ""
    }])
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>아이 정보 추가</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error.message}
            </div>
          )}

          <p className="text-sm text-gray-600">
            자녀 정보를 등록하면 연령대에 맞는 콘텐츠를 추천받을 수 있어요.
          </p>

          {children.map((child, index) => (
            <Card key={child.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">자녀 {index + 1}</h4>
                  {children.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChild(child.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>이름</Label>
                    <Input
                      placeholder="자녀 이름"
                      value={child.name}
                      onChange={(e) => updateChild(child.id, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>생년월일</Label>
                    <Input
                      type="date"
                      value={child.birthDate}
                      onChange={(e) => updateChild(child.id, "birthDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>성별</Label>
                    <Select 
                      value={child.gender} 
                      onValueChange={(value) => updateChild(child.id, "gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="성별 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">남자</SelectItem>
                        <SelectItem value="female">여자</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>연령대</Label>
                    <Select
                      value={child.ageGroup}
                      onValueChange={(value) => updateChild(child.id, "ageGroup", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="연령대 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {AGE_GROUPS.map((group) => (
                          <SelectItem key={group.value} value={group.value}>
                            {group.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Button 
            variant="outline" 
            onClick={addChildToList} 
            className="w-full border-dashed bg-transparent"
          >
            자녀 추가
          </Button>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              취소
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || children.every(child => !child.name || !child.birthDate || !child.gender || !child.ageGroup)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              {isLoading ? "추가 중..." : "추가"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
