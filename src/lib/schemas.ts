import { z } from "zod"

// User Schema
export const UserSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  email: z.string().email(),
  nickname: z.string().min(2).max(20),
  avatar: z.string().optional(),
  location: z.string().optional(),
  interests: z.array(z.string()).default([]),
  verified: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  bio: z.string().optional(),
  postsCount: z.number().optional(),
  followersCount: z.number().optional(),
  followingCount: z.number().optional(),
  lastSeenAt: z.date().optional()
})

// Child Profile Schema
export const ChildSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  parentId: z.string(),
  name: z.string().min(1).max(20),
  age: z.number().min(0).max(12),
  gender: z.enum(["male", "female"]),
  avatar: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
})

// Post Schema
export const PostSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  authorId: z.string(),
  content: z.string().min(1).max(1000),
  images: z.array(z.string()).default([]),
  category: z.enum(["play", "health", "education", "food", "products", "advice"]),
  ageGroup: z.enum(["0-2", "3-5", "6-8", "9-12", "all"]),
  tags: z.array(z.string()).default([]),
  likes: z.array(z.string()).default([]),
  bookmarks: z.array(z.string()).default([]),
  commentCount: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

// Comment Schema
export const CommentSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  postId: z.string(),
  authorId: z.string(),
  content: z.string().min(1).max(500),
  parentId: z.string().optional(),
  likes: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date()),
})

export type User = z.infer<typeof UserSchema>
export type Child = z.infer<typeof ChildSchema>
export type Post = z.infer<typeof PostSchema>
export type Comment = z.infer<typeof CommentSchema>

// API Response types
export interface PostWithAuthor extends Post {
  author: {
    id: string
    nickname: string
    avatar?: string
  }
  likesCount: number
  bookmarksCount: number
  isLiked?: boolean
  isBookmarked?: boolean
  createdAt: string
  updatedAt: string
}
