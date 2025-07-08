"use client"
import { ProfileHeader } from "./profile-header"
import { ProfileStats } from "./profile-stats"
import { ProfileChildren } from "./profile-children"
import { ProfileInterests } from "./profile-interests"
import { ProfileActions } from "./profile-actions"
import { useAuthStore } from "@/stores/auth-store"

export function ProfileContent() {
  const { user } = useAuthStore()

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">로그인이 필요합니다.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <ProfileHeader user={user} />
      <ProfileStats />
      <ProfileChildren user={user} />
      <ProfileInterests user={user} />
      <ProfileActions />
    </div>
  )
}
