
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromCookies(request)
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const commentId = params.id

    if (!commentId) {
      return NextResponse.json({ error: "댓글 ID가 필요합니다" }, { status: 400 })
    }

    // Check if already liked
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        commentId: commentId,
      },
    })

    if (existingLike) {
      // Remove like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      // Update comment like count
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
        select: { likesCount: true },
      })

      return NextResponse.json({
        success: true,
        isLiked: false,
        likesCount: updatedComment.likesCount,
      })
    } else {
      // Add like
      await prisma.like.create({
        data: {
          userId: userId,
          commentId: commentId,
        },
      })

      // Update comment like count
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          likesCount: {
            increment: 1,
          },
        },
        select: { likesCount: true },
      })

      return NextResponse.json({
        success: true,
        isLiked: true,
        likesCount: updatedComment.likesCount,
      })
    }
  } catch (error) {
    console.error("Error toggling comment like:", error)
    return NextResponse.json({ error: "좋아요 처리에 실패했습니다" }, { status: 500 })
  }
}
