import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"
import { LikeType } from "@prisma/client"

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

    // 기존 좋아요 확인
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        postId: postId,
        type: LikeType.POST,
      },
    })

    if (existingLike) {
      // 좋아요 제거
      await prisma.like.deleteMany({
        where: {
          userId: userId,
          postId: postId,
          type: LikeType.POST,
        },
      })

      // 게시글 좋아요 수 감소
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
        select: { likesCount: true },
      })

      return NextResponse.json({
        success: true,
        liked: false,
        likesCount: Math.max(0, updatedPost.likesCount), // 0 이하로 떨어지지 않도록
      })
    } else {
      // 좋아요 추가
      await prisma.like.create({
        data: {
          userId: userId,
          postId: postId,
          type: LikeType.POST, // Add type explicitly
        },
      })

      // 게시글 좋아요 수 증가
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          likesCount: {
            increment: 1,
          },
        },
        select: { likesCount: true },
      })

      return NextResponse.json({
        success: true,
        liked: true,
        likesCount: updatedPost.likesCount,
      })
    }
  } catch (error) {
    console.error("좋아요 처리 중 오류:", error)
    return NextResponse.json({ error: "좋아요 처리에 실패했습니다" }, { status: 500 })
  }
}