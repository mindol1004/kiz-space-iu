
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

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    })

    if (existingLike) {
      // Remove like
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: postId,
          },
        },
      })

      // Update post like count
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
        isLiked: false,
        likesCount: updatedPost.likesCount,
      })
    } else {
      // Add like
      await prisma.like.create({
        data: {
          userId: userId,
          postId: postId,
        },
      })

      // Update post like count
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
        isLiked: true,
        likesCount: updatedPost.likesCount,
      })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "좋아요 처리에 실패했습니다" }, { status: 500 })
  }
}
