
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromCookies } from "@/lib/auth-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 인증 확인
    const currentUser = await getUserFromCookies(request)
    if (!currentUser) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 })
    }

    const userId = params.id

    // 사용자 존재 확인
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다" }, { status: 404 })
    }

    // 통계 데이터 계산
    const [postsCount, likesCount, commentsCount, bookmarksCount] = await Promise.all([
      prisma.post.count({ where: { authorId: userId } }),
      prisma.like.count({ where: { userId, type: 'POST' } }),
      prisma.comment.count({ where: { authorId: userId } }),
      prisma.bookmark.count({ where: { userId } })
    ])

    const stats = [
      { label: "게시글", value: postsCount, icon: "Edit" },
      { label: "좋아요", value: likesCount, icon: "Heart" },
      { label: "댓글", value: commentsCount, icon: "MessageCircle" },
      { label: "북마크", value: bookmarksCount, icon: "Bookmark" },
    ]

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching profile stats:", error)
    return NextResponse.json(
      { error: "통계 조회 실패" },
      { status: 500 }
    )
  }
}
