import type React from "react"
export interface ProfileUser {
  _id: string
  nickname: string
  location: string
  createdAt: Date
  verified: boolean
  interests: string[]
  avatar?: string
}

export interface ProfileStat {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}

export interface ProfileChild {
  name: string
  age: number
  gender: "male" | "female"
  parentId: string
}
