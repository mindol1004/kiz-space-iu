
"use client"

import { Edit, Heart, MessageCircle, Bookmark } from "lucide-react"
import { useAuthStore } from "@/shared/stores/auth-store"
import { ProfileContent } from "@/features/profile/components/profile-content"

export default function ProfilePage() {
  const { user } = useAuthStore()

  const stats = [
    { label: "게시글", value: user?.postsCount || 0, icon: Edit },
    { label: "좋아요", value: 156, icon: Heart },
    { label: "댓글", value: 89, icon: MessageCircle },
    { label: "북마크", value: 32, icon: Bookmark },
  ]

  // 임시로 빈 배열 사용 - 실제로는 children API에서 가져와야 함
  const userChildren: any[] = []

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">로그인이 필요합니다.</p>
      </div>
    )
  }

  return (
    <ProfileContent user={user} userChildren={userChildren} stats={stats} />
  )
}
