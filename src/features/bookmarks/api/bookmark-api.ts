
import { apiClient } from '@/lib/axios-config'

export interface BookmarkResponse {
  bookmarks: any[]
  hasMore: boolean
  nextPage?: number
  total: number
}

export interface CreateBookmarkData {
  postId: string
  category?: string
  notes?: string
}

export interface BookmarkApiResponse {
  success: boolean
  bookmark?: any
  isBookmarked?: boolean
  bookmarksCount?: number
}

export class BookmarkAPI {
  // 북마크 목록 조회
  static async getBookmarks(params: {
    page?: number
    limit?: number
    category?: string
  }): Promise<BookmarkResponse> {
    const searchParams = new URLSearchParams()

    if (params.page) {
      searchParams.append('page', params.page.toString())
    }

    if (params.limit) {
      searchParams.append('limit', params.limit.toString())
    }

    if (params.category && params.category !== 'all') {
      searchParams.append('category', params.category)
    }

    const response = await apiClient.get<BookmarkResponse>(
      `/bookmarks?${searchParams.toString()}`
    )
    return response.data
  }

  // 북마크 추가
  static async addBookmark(data: CreateBookmarkData): Promise<BookmarkApiResponse> {
    const response = await apiClient.post<BookmarkApiResponse>('/bookmarks', data)
    return response.data
  }

  // 북마크 삭제
  static async removeBookmark(postId: string): Promise<BookmarkApiResponse> {
    const response = await apiClient.delete<BookmarkApiResponse>(
      `/bookmarks?postId=${postId}`
    )
    return response.data
  }

  // 포스트 북마크 토글 (기존 포스트 API와의 호환성을 위해)
  static async toggleBookmark(postId: string): Promise<BookmarkApiResponse> {
    const response = await apiClient.post<BookmarkApiResponse>(
      `/posts/${postId}/bookmark`
    )
    return response.data
  }
}
