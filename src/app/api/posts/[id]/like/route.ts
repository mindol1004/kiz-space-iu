
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const POST = withAuth(async (
  request: NextRequest,
  auth: { user: any },
  { params }: { params: { id: string } }
) => {
  try {
    const { id: postId } = params

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: auth.user.id,
          postId,
        },
      },
    })

    if (existingLike) {
      // Unlike - 트랜잭션으로 좋아요 삭제와 카운트 업데이트를 동시에 처리
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.post.update({
          where: { id: postId },
          data: {
            likesCount: {
              decrement: 1,
            },
          },
        }),
      ])

      // 업데이트된 좋아요 수 조회
      const updatedPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { likesCount: true },
      })

      return NextResponse.json({
        success: true,
        liked: false,
        likesCount: updatedPost?.likesCount || 0,
        message: "Post unliked",
      })
    } else {
      // Like - 트랜잭션으로 좋아요 생성과 카운트 업데이트를 동시에 처리
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId: auth.user.id,
            postId,
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: {
            likesCount: {
              increment: 1,
            },
          },
        }),
      ])

      // 업데이트된 좋아요 수 조회
      const updatedPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { likesCount: true },
      })

      return NextResponse.json({
        success: true,
        liked: true,
        likesCount: updatedPost?.likesCount || 0,
        message: "Post liked",
      })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
})
