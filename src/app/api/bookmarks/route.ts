
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const GET = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const where: any = {
      userId: auth.user.id
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
                avatar: true
              }
            },
            _count: {
              select: {
                comments: true,
                likes: true,
                bookmarks: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.bookmark.count({ where })

    return NextResponse.json({
      bookmarks: bookmarks.map(bookmark => ({
        ...bookmark,
        post: {
          ...bookmark.post,
          commentCount: bookmark.post._count.comments,
          likesCount: bookmark.post._count.likes,
          bookmarksCount: bookmark.post._count.bookmarks
        }
      })),
      hasMore: bookmarks.length === limit,
      nextPage: bookmarks.length === limit ? page + 1 : undefined,
      total
    })
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: "북마크를 불러오는데 실패했습니다" }, { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { postId, category, notes } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    // 이미 북마크했는지 확인
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: auth.user.id,
          postId
        }
      }
    })

    if (existingBookmark) {
      return NextResponse.json({ error: "이미 북마크한 포스트입니다" }, { status: 409 })
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: auth.user.id,
        postId,
        category: category || null,
        notes: notes || null
      }
    })

    // 포스트의 북마크 카운트 업데이트
    await prisma.post.update({
      where: { id: postId },
      data: {
        bookmarksCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      bookmark
    })
  } catch (error) {
    console.error("Error creating bookmark:", error)
    return NextResponse.json({ error: "북마크 생성에 실패했습니다" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: auth.user.id,
          postId
        }
      }
    })

    if (!bookmark) {
      return NextResponse.json({ error: "북마크를 찾을 수 없습니다" }, { status: 404 })
    }

    await prisma.bookmark.delete({
      where: {
        id: bookmark.id
      }
    })

    // 포스트의 북마크 카운트 업데이트
    await prisma.post.update({
      where: { id: postId },
      data: {
        bookmarksCount: {
          decrement: 1
        }
      }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error("Error deleting bookmark:", error)
    return NextResponse.json({ error: "북마크 삭제에 실패했습니다" }, { status: 500 })
  }
})
