
import { apiClient } from '@/lib/axios-config'

export interface Comment {
  id: string
  content: string
  author: {
    id: string
    nickname: string
    avatar?: string
  }
  createdAt: string
  postId: string
  parentId?: string
  replies?: Comment[]
  likesCount?: number
  repliesCount?: number
}

export interface CreateCommentData {
  content: string
  postId: string
  parentId?: string
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
}

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
  static async likeComment(commentId: string): Promise<{ liked: boolean; likesCount: number }> {
    const response = await apiClient.post<{ success: boolean; liked: boolean; likesCount: number }>(`/comments/${commentId}/like`)
    return {
      liked: response.data.liked,
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
