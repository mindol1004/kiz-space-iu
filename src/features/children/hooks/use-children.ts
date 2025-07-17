import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface CreateChildData {
  name: string
  age: string
  gender: "boy" | "girl"
  parentId: string
  birthDate?: string
}

interface UpdateChildData {
  name?: string
  age?: string
  gender?: "boy" | "girl"
}

export function useChildren(parentId: string) {
  return useQuery({
    queryKey: ["children", parentId],
    queryFn: async () => {
      const response = await fetch(`/api/children`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "자녀 정보를 불러오는데 실패했습니다")
      }

      return result.children
    },
    enabled: !!parentId,
  })
}

export function useCreateChild() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: CreateChildData) => {
      const response = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "자녀 정보 추가에 실패했습니다")
      }

      return result.child
    },
    onSuccess: (child) => {
      queryClient.invalidateQueries({ queryKey: ["children", child.parentId] })
      toast({
        title: "자녀 정보 추가 완료",
        description: "자녀 정보가 성공적으로 추가되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "자녀 정보 추가 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useUpdateChild() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ childId, data }: { childId: string; data: UpdateChildData }) => {
      const response = await fetch(`/api/children/${childId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "자녀 정보 수정에 실패했습니다")
      }

      return result.child
    },
    onSuccess: (child) => {
      queryClient.invalidateQueries({ queryKey: ["children"] })
      toast({
        title: "자녀 정보 수정 완료",
        description: "자녀 정보가 성공적으로 수정되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "자녀 정보 수정 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export function useDeleteChild() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (childId: string) => {
      const response = await fetch(`/api/children/${childId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "자녀 정보 삭제에 실패했습니다")
      }

      return childId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] })
      toast({
        title: "자녀 정보 삭제 완료",
        description: "자녀 정보가 성공적으로 삭제되었습니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "자녀 정보 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
