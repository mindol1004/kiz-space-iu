
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
    const { category, notes } = await request.json()

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if already bookmarked
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: auth.user.id,
          postId,
        },
      },
    })

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      })

      return NextResponse.json({
        success: true,
        bookmarked: false,
        message: "Bookmark removed",
      })
    } else {
      // Add bookmark
      const bookmark = await prisma.bookmark.create({
        data: {
          userId: auth.user.id,
          postId,
          category,
          notes,
        },
      })

      return NextResponse.json({
        success: true,
        bookmarked: true,
        bookmark,
        message: "Post bookmarked",
      })
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 })
  }
})
