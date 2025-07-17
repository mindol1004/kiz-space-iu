
"use client"

import { useState } from "react"
import { useCreateChild } from "./use-children"

interface UseChildAddModalProps {
  parentId: string
  onSuccess?: () => void
}

export function useChildAddModal({ parentId, onSuccess }: UseChildAddModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "" as "boy" | "girl" | "",
    birthDate: "",
  })

  const createChildMutation = useCreateChild()

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.age || !formData.gender) {
      return
    }

    try {
      await createChildMutation.mutateAsync({
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        parentId,
        birthDate: formData.birthDate || undefined,
      })

      // 성공 시 폼 초기화 및 모달 닫기
      setFormData({
        name: "",
        age: "",
        gender: "",
        birthDate: "",
      })
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      // 에러는 useCreateChild에서 toast로 처리됨
    }
  }

  const openModal = () => setIsOpen(true)
  const closeModal = () => {
    setIsOpen(false)
    setFormData({
      name: "",
      age: "",
      gender: "",
      birthDate: "",
    })
  }

  const addChild = async (children: any[]) => {
    if (children.length > 0) {
      const child = children[0]
      await createChildMutation.mutateAsync({
        name: child.name,
        age: child.age,
        gender: child.gender,
        parentId,
        birthDate: child.birthDate || undefined,
      })
    }
  }

  return {
    isOpen,
    formData,
    isLoading: createChildMutation.isPending,
    error: createChildMutation.error,
    openModal,
    closeModal,
    handleInputChange,
    handleSubmit,
    addChild,
  }
}
