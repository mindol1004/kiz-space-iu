
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromCookies(request)
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const category = searchParams.get("category")

    const where: any = {
      userId: userId,
    }

    if (category && category !== "all") {
      where.post = {
        category: category
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

    const total = await prisma.bookmark.count({ where })

    return NextResponse.json({
      bookmarks,
      hasMore: total > page * limit,
      nextPage: total > page * limit ? page + 1 : undefined,
      total,
    })
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json({ error: "북마크를 불러오는데 실패했습니다" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromCookies(request)
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const { postId, category, notes } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    // 포스트 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json({ error: "존재하지 않는 포스트입니다" }, { status: 404 })
    }

    // 기존 북마크 확인
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    })

    if (existingBookmark) {
      return NextResponse.json({ error: "이미 북마크에 추가된 포스트입니다" }, { status: 400 })
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: userId,
        postId: postId,
        category: category || post.category, // 포스트의 카테고리를 기본값으로 사용
        notes: notes || null,
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

    // 포스트 북마크 수 증가
    await prisma.post.update({
      where: { id: postId },
      data: {
        bookmarksCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ bookmark })
  } catch (error) {
    console.error("Error creating bookmark:", error)
    return NextResponse.json({ error: "북마크 추가에 실패했습니다" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromCookies(request)
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    // 북마크 존재 확인
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    })

    if (!existingBookmark) {
      return NextResponse.json({ error: "북마크를 찾을 수 없습니다" }, { status: 404 })
    }

    const bookmark = await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    })

    // 포스트 북마크 수 감소
    await prisma.post.update({
      where: { id: postId },
      data: {
        bookmarksCount: {
          decrement: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bookmark:", error)
    return NextResponse.json({ error: "북마크 삭제에 실패했습니다" }, { status: 500 })
  }
}
