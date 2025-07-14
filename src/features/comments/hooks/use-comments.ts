import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/shared/stores/auth-store"
import { CommentsAPI } from "../api/comment-api"
import { Comment, CreateCommentData } from "../types/comment-types"
import { toast } from "sonner"

export function useComments(postId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await CommentsAPI.getComments(postId)
      return response
    },
    enabled: !!postId && (options?.enabled !== false),
    staleTime: 30000, // 30초간 캐시 유지
    refetchOnWindowFocus: false, // 윈도우 포커스시 refetch 비활성화
  })
}

export function useCreateComment() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateCommentData) => {
      if (!user) throw new Error("로그인이 필요합니다")
      return CommentsAPI.createComment(data)
    },
    onSuccess: (comment) => {
      // 해당 게시글의 댓글 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: ["comments", comment.postId] 
      })
      toast.success("댓글이 작성되었습니다.")
    },
    onError: (error) => {
      console.error("댓글 작성 오류:", error)
      toast.error("댓글 작성 중 오류가 발생했습니다.")
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CommentsAPI.deleteComment,
    onSuccess: () => {
      // 모든 댓글 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["comments"] })
      toast.success("댓글이 삭제되었습니다.")
    },
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
      toast.error("댓글 삭제 중 오류가 발생했습니다.")
    },
  })
}

export function useLikeComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CommentsAPI.likeComment,
    onSuccess: (data, commentId) => {
      // 댓글 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
    onError: (error) => {
      console.error("댓글 좋아요 오류:", error)
      toast.error("좋아요 처리 중 오류가 발생했습니다.")
    },
  })
}

export function useCreateReply() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ parentId, content, postId }: { parentId: string; content: string; postId: string }) => {
      if (!user) throw new Error("로그인이 필요합니다")
      return CommentsAPI.createReply(parentId, { content, postId })
    },
    onSuccess: (reply) => {
      // 해당 게시글의 댓글 목록 무효화
      queryClient.invalidateQueries({ 
        queryKey: ["comments", reply.postId] 
      })
      toast.success("답글이 작성되었습니다.")
    },
    onError: (error) => {
      console.error("답글 작성 오류:", error)
      toast.error("답글 작성 중 오류가 발생했습니다.")
    },
  })
}

export function useUpdateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      CommentsAPI.updateComment(commentId, content),
    onSuccess: (updatedComment) => {
      // 댓글 목록 캐시 업데이트
      queryClient.setQueriesData(
        { queryKey: ["comments"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              comments: page.comments.map((comment: Comment) => {
                if (comment.id === updatedComment.id) {
                  return updatedComment
                }
                // 대댓글도 업데이트
                if (comment.replies) {
                  return {
                    ...comment,
                    replies: comment.replies.map((reply: Comment) =>
                      reply.id === updatedComment.id ? updatedComment : reply
                    )
                  }
                }
                return comment
              })
            }))
          }
        }
      )
      toast.success("댓글이 수정되었습니다.")
    },
    onError: (error) => {
      console.error("댓글 수정 오류:", error)
      toast.error("댓글 수정 중 오류가 발생했습니다.")
    },, content }: { commentId: string; content: string }) => 
      CommentsAPI.updateComment(commentId, content),
    onSuccess: () => {
      // 모든 댓글 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["comments"] })
      toast.success("댓글이 수정되었습니다.")
    },
    onError: (error) => {
      console.error("댓글 수정 오류:", error)
      toast.error("댓글 수정 중 오류가 발생했습니다.")
    },
  })
}