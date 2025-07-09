
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const GET = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")

    const where: any = {
      userId: auth.user.id,
    }

    if (category && category !== "all") {
      where.category = category
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

    const total = await prisma.bookmark.count({ where })

    return NextResponse.json({
      bookmarks: bookmarks.map((bookmark) => ({
        ...bookmark,
        post: {
          ...bookmark.post,
          commentCount: bookmark.post._count.comments,
          likesCount: bookmark.post._count.likes,
          bookmarksCount: bookmark.post._count.bookmarks,
        },
      })),
      hasMore: bookmarks.length === limit,
      nextPage: bookmarks.length === limit ? page + 1 : undefined,
      total,
    })
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { postId, category, notes } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

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
      return NextResponse.json({ error: "Post already bookmarked" }, { status: 409 })
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: auth.user.id,
        postId,
        category,
        notes,
      },
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
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      bookmark,
    })
  } catch (error) {
    console.error("Error creating bookmark:", error)
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: auth.user.id,
          postId,
        },
      },
    })

    if (!bookmark) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 })
    }

    await prisma.bookmark.delete({
      where: {
        id: bookmark.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Bookmark removed",
    })
  } catch (error) {
    console.error("Error deleting bookmark:", error)
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 })
  }
})
