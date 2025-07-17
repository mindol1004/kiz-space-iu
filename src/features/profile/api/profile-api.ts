import { apiClient } from "@/lib/axios-config"
import type { 
  UserProfile, 
  ProfileStats, 
  UserPost, 
  UserPostsResponse 
} from "../types/profile-types"

export const ProfileAPI = {
  // 사용자 프로필 조회
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
  },

  // 프로필 통계 조회
  async getProfileStats(userId: string): Promise<ProfileStats[]> {
    const response = await apiClient.get(`/users/${userId}/stats`)
    return response.data
  },

  // 사용자 게시글 조회
  async getUserPosts(userId: string, page: number = 1, limit: number = 10): Promise<UserPostsResponse> {
    const response = await apiClient.get(`/users/${userId}/posts`, {
      params: { page, limit }
    })
    return response.data
  },

  // 아바타 업로드
  async uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await apiClient.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}
```The code is modified to use `apiClient` from `axios-config` instead of `axiosInstance` for making API calls.
<replit_final_file>
import { apiClient } from "@/lib/axios-config"
import type { 
  UserProfile, 
  ProfileStats, 
  UserPost, 
  UserPostsResponse 
} from "../types/profile-types"

export const ProfileAPI = {
  // 사용자 프로필 조회
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
  },

  // 프로필 통계 조회
  async getProfileStats(userId: string): Promise<ProfileStats[]> {
    const response = await apiClient.get(`/users/${userId}/stats`)
    return response.data
  },

  // 사용자 게시글 조회
  async getUserPosts(userId: string, page: number = 1, limit: number = 10): Promise<UserPostsResponse> {
    const response = await apiClient.get(`/users/${userId}/posts`, {
      params: { page, limit }
    })
    return response.data
  },

  // 아바타 업로드
  async uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await apiClient.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}