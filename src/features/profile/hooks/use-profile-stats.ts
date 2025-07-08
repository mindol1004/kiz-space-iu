"use client"

import { useMemo } from "react"
import { Edit, Heart, MessageCircle, Bookmark } from "lucide-react"
import type { ProfileStat } from "../types/profile-types"

export function useProfileStats() {
  const stats: ProfileStat[] = useMemo(
    () => [
      { label: "게시글", value: 24, icon: Edit },
      { label: "좋아요", value: 156, icon: Heart },
      { label: "댓글", value: 89, icon: MessageCircle },
      { label: "북마크", value: 32, icon: Bookmark },
    ],
    [],
  )

  return { stats }
}
