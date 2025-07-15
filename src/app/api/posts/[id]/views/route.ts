import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromCookies(request)
    const postId = params.id

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    // 사용자가 이미 조회했는지 확인 (로그인한 경우에만)
    if (userId) {
      const existingView = await prisma.postView.findUnique({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      })

      if (existingView) {
        // 이미 조회한 경우 현재 조회수만 반환
        const post = await prisma.post.findUnique({
          where: { id: postId },
          select: { viewsCount: true },
        })
        return NextResponse.json({ viewsCount: post?.viewsCount || 0 }, { status: 200 })
      }

      // 새로운 조회 기록 생성
      await prisma.postView.create({
        data: {
          userId: userId,
          postId: postId,
        },
      })
    }

    // 조회수 증가
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
      select: { viewsCount: true },
    })

    return NextResponse.json({ viewsCount: updatedPost.viewsCount }, { status: 200 })
  } catch (error) {
    console.error("Error incrementing views:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "조회수 증가에 실패했습니다" }, { status: 500 })
  }
}