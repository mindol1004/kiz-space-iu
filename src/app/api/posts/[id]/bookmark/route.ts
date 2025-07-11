import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromCookies(request)
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const postId = params.id

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    // 기존 북마크 확인
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    })

    if (existingBookmark) {
      // 북마크 제거
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      })

      // 게시글 북마크 수 감소
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          bookmarksCount: {
            decrement: 1,
          },
        },
        select: { bookmarksCount: true },
      })

      return NextResponse.json({
        success: true,
        isBookmarked: false,
        bookmarksCount: Math.max(0, updatedPost.bookmarksCount), // 0 이하로 떨어지지 않도록
      })
    } else {
      // 북마크 추가
      await prisma.bookmark.create({
        data: {
          userId: userId,
          postId: postId,
        },
      })

      // 게시글 북마크 수 증가
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          bookmarksCount: {
            increment: 1,
          },
        },
        select: { bookmarksCount: true },
      })

      return NextResponse.json({
        success: true,
        isBookmarked: true,
        bookmarksCount: updatedPost.bookmarksCount,
      })
    }
  } catch (error) {
    console.error("북마크 처리 중 오류:", error)
    return NextResponse.json({ error: "북마크 처리에 실패했습니다" }, { status: 500 })
  }
}