import { apiClient } from '@/lib/axios-config'
import { 
  Comment, 
  CreateCommentData, 
  CommentsResponse, 
  CommentLikeResponse 
} from '../types/comment-types'

export class CommentsAPI {
  // 댓글 목록 조회
  static async getComments(postId: string, page: number = 1, limit: number = 10): Promise<CommentsResponse> {
    const response = await apiClient.get<CommentsResponse>(`/comments?postId=${postId}&page=${page}&limit=${limit}`)
    return response.data
  }

  // 댓글 생성
  static async createComment(data: CreateCommentData): Promise<Comment> {
    const response = await apiClient.post<{ success: boolean; comment: Comment }>('/comments', data)
    return response.data.comment
  }

  // 댓글 삭제
  static async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(`/comments/${commentId}`)
  }

  // 댓글 좋아요 토글
  static async likeComment(commentId: string): Promise<CommentLikeResponse> {
    const response = await apiClient.post<{ success: boolean; isLiked: boolean; likesCount: number }>(`/comments/${commentId}/like`)
    return {
      liked: response.data.isLiked,
      likesCount: response.data.likesCount
    }
  }

  // 대댓글 생성
  static async createReply(parentId: string, data: Omit<CreateCommentData, 'parentId'>): Promise<Comment> {
    const response = await apiClient.post<{ success: boolean; comment: Comment }>('/comments', {
      ...data,
      parentId
    })
    return response.data.comment
  }
}
