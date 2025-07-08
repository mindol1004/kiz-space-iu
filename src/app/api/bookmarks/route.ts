import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const where: any = {
      userId,
    }

    if (category && category !== "all") {
      where.post = {
        category,
      }
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
                bookmarks: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      bookmarks: bookmarks.map((bookmark) => ({
        ...bookmark.post,
        commentCount: bookmark.post._count.comments,
        likesCount: bookmark.post._count.likes,
        bookmarksCount: bookmark.post._count.bookmarks,
        bookmarkedAt: bookmark.createdAt,
      })),
      hasMore: bookmarks.length === limit,
    })
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}
