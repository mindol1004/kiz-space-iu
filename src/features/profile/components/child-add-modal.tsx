
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useCreateChild } from "@/features/children/hooks/use-children"
import { useAuthStore } from "@/shared/stores/auth-store"
import { cn } from "@/lib/utils"

interface ChildAddModalProps {
  onSuccess?: () => void
}

export function ChildAddModal({ onSuccess }: ChildAddModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthDate: undefined as Date | undefined,
  })

  const { user } = useAuthStore()
  const { mutate: createChild, isPending } = useCreateChild()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !formData.name || !formData.gender) {
      return
    }

    // 생년월일로부터 나이 계산
    let age = 0
    if (formData.birthDate) {
      const today = new Date()
      age = today.getFullYear() - formData.birthDate.getFullYear()
      const monthDiff = today.getMonth() - formData.birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < formData.birthDate.getDate())) {
        age--
      }
    }

    createChild({
      name: formData.name,
      age: age.toString(),
      gender: formData.gender as "boy" | "girl",
      parentId: user.id,
      birthDate: formData.birthDate?.toISOString(),
    }, {
      onSuccess: () => {
        setOpen(false)
        setFormData({ name: "", gender: "", birthDate: undefined })
        onSuccess?.()
      }
    })
  }

  const resetForm = () => {
    setFormData({ name: "", gender: "", birthDate: undefined })
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          자녀 정보 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>자녀 정보 추가</DialogTitle>
        </DialogHeader>
        
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  placeholder="자녀 이름을 입력해주세요"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>성별 *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="성별을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boy">남아</SelectItem>
                    <SelectItem value="girl">여아</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>생년월일</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.birthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.birthDate ? (
                        format(formData.birthDate, "yyyy년 MM월 dd일", { locale: ko })
                      ) : (
                        "생년월일을 선택해주세요"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.birthDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, birthDate: date }))}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      locale={ko}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {formData.birthDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 bg-blue-50 rounded-lg"
                >
                  <p className="text-sm text-blue-700">
                    현재 나이: {(() => {
                      const today = new Date()
                      let age = today.getFullYear() - formData.birthDate!.getFullYear()
                      const monthDiff = today.getMonth() - formData.birthDate!.getMonth()
                      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < formData.birthDate!.getDate())) {
                        age--
                      }
                      return age
                    })()}세
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              disabled={isPending || !formData.name || !formData.gender}
            >
              {isPending ? "추가 중..." : "추가"}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
