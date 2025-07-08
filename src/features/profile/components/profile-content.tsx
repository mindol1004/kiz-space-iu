"use client"
import { ProfileHeader } from "./profile-header"
import { ProfileStats } from "./profile-stats"
import { ProfileChildren } from "./profile-children"
import { ProfileInterests } from "./profile-interests"
import { ProfileActions } from "./profile-actions"
import type { ProfileUser, ProfileStat, ProfileChild } from "../types/profile-types"

interface ProfileContentProps {
  user: ProfileUser;
  userChildren: ProfileChild[];
  stats: ProfileStat[];
}

export function ProfileContent({ user, userChildren, stats }: ProfileContentProps) {
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
      <ProfileStats stats={stats} />
      <ProfileChildren user={user} userChildren={userChildren} />
      <ProfileInterests user={user} />
      <ProfileActions />
    </div>
  )
}
