import { apiClient } from '@/lib/axios-config'
import { CreatePostData, Post, PostsResponse, UsePostsParams, LikeApiResponse, BookmarkApiResponse, ViewsApiResponse } from '../types/post-type'

export class PostsAPI {
  // 게시글 목록 조회
  static async getPosts(params: UsePostsParams & { page?: number; limit?: number }): Promise<PostsResponse> {
    const searchParams = new URLSearchParams()

    if (params.category && params.category !== 'all') {
      searchParams.append('category', params.category)
    }

    if (params.ageGroup && params.ageGroup !== 'all') {
      searchParams.append('ageGroup', params.ageGroup)
    }

    if (params.page) {
      searchParams.append('page', params.page.toString())
    }

    if (params.limit) {
      searchParams.append('limit', params.limit.toString())
    }

    const response = await apiClient.get<PostsResponse>(`/posts?${searchParams.toString()}`)
    return response.data
  }

  // 특정 게시글 조회
  static async getPost(id: string): Promise<Post> {
    const response = await apiClient.get<Post>(`/posts/${id}`)
    return response.data
  }

  // 게시글 생성
  static async createPost(data: CreatePostData): Promise<Post> {
    const response = await apiClient.post<{ success: boolean; post: Post }>('/posts', data)
    return response.data.post
  }

  // 게시글 수정
  static async updatePost(id: string, data: Partial<CreatePostData>): Promise<Post> {
    const response = await apiClient.put<{ success: boolean; post: Post }>(`/posts/${id}`, data)
    return response.data.post
  }

  // 게시글 삭제
  static async deletePost(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(`/posts/${id}`)
    return response.data
  }

  // 게시글 좋아요 토글
  static async likePost(postId: string): Promise<LikeApiResponse> {
    const response = await apiClient.post<LikeApiResponse>(`/posts/${postId}/like`)
    return response.data
  }

  // 게시글 북마크 토글
  static async bookmarkPost(postId: string): Promise<BookmarkApiResponse> {
    const response = await apiClient.post<BookmarkApiResponse>(`/posts/${postId}/bookmark`)
    return response.data
  }

  static async incrementViews(postId: string, userId?: string): Promise<ViewsApiResponse> {
    const response = await apiClient.post<ViewsApiResponse>(`/posts/${postId}/views`, { userId })
    return response.data
  }
}