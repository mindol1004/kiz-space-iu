
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
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      })

      return NextResponse.json({
        success: true,
        liked: false,
        message: "Post unliked",
      })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: auth.user.id,
          postId,
        },
      })

      return NextResponse.json({
        success: true,
        liked: true,
        message: "Post liked",
      })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
})
