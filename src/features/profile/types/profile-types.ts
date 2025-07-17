
import { Post } from "@/features/posts/types/post-type"
import type React from "react"

export interface ProfileUser {
  _id?: string
  id?: string
  nickname: string
  name?: string
  email?: string
  bio?: string
  location?: string
  createdAt: Date
  verified: boolean
  interests: string[]
  avatar?: string
  postsCount?: number
  followersCount?: number
  followingCount?: number
  isFollowing?: boolean
}

export interface ProfileStat {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}

export interface ProfileChild {
  id: string
  name: string
  age: number
  gender: "male" | "female"
  parentId: string
  birthDate?: Date
  avatar?: string
}

export interface ProfileTabType {
  value: string
  label: string
  count?: number
}

export interface UserPostsResponse {
  posts: Post[]
  totalPosts: number
  totalPages: number
  currentPage: number
}

export interface UserProfile {
  id: string
  nickname: string
  name?: string
  email?: string
  bio?: string
  location?: string
  createdAt: Date
  verified: boolean
  interests: string[]
  avatar?: string
  postsCount?: number
  followersCount?: number
  followingCount?: number
  isFollowing?: boolean
}

export interface ProfileStats {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}
