import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: params.id,
        },
      },
    })

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId,
            postId: params.id,
          },
        },
      })
      return NextResponse.json({ success: true, isBookmarked: false })
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId,
          postId: params.id,
        },
      })
      return NextResponse.json({ success: true, isBookmarked: true })
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 })
  }
}
