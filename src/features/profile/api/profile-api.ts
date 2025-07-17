
import { axiosInstance } from "@/lib/axios-config"
import type { ProfileUser, ProfileStat } from "../types/profile-types"

export const ProfileAPI = {
  async getProfile(userId: string): Promise<ProfileUser> {
    const response = await axiosInstance.get(`/api/users/${userId}`)
    return response.data.user
  },

  async updateProfile(userId: string, data: Partial<ProfileUser>): Promise<ProfileUser> {
    const response = await axiosInstance.put(`/api/users/${userId}`, data)
    return response.data.user
  },

  async getProfileStats(userId: string): Promise<ProfileStat[]> {
    const response = await axiosInstance.get(`/api/users/${userId}/stats`)
    return response.data.stats
  },

  async getUserPosts(userId: string, page = 1, limit = 10) {
    const response = await axiosInstance.get(`/api/users/${userId}/posts`, {
      params: { page, limit }
    })
    return response.data
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await axiosInstance.post(`/api/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.avatarUrl
  }
}
