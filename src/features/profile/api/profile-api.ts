
import { axiosInstance } from "@/lib/axios-config"
import type { ProfileUser, ProfileStat } from "../types/profile-types"

export const ProfileAPI = {
  async getProfile(userId: string): Promise<ProfileUser> {
    const response = await axiosInstance.get(`/users/${userId}`)
    return response.data
  },

  async updateProfile(userId: string, data: Partial<ProfileUser>): Promise<ProfileUser> {
    const response = await axiosInstance.put(`/users/${userId}`, data)
    return response.data
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await axiosInstance.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.avatarUrl
  },

  async getProfileStats(userId: string): Promise<ProfileStat[]> {
    const response = await axiosInstance.get(`/users/${userId}/stats`)
    return response.data
  },
}
