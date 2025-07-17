
"use client"

import { ProfileContent } from "@/features/profile/components/profile-content"
import { useAuthStore } from "@/shared/stores/auth-store"

export default function ProfilePage() {
  const { user } = useAuthStore()

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">로그인이 필요합니다.</p>
      </div>
    )
  }

  return <ProfileContent userId={user.id} />
}
