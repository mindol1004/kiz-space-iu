import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const ageGroup = searchParams.get("ageGroup")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const where: any = {}
    if (category && category !== "all") {
      where.category = category
    }
    if (ageGroup && ageGroup !== "all") {
      where.ageGroup = ageGroup
    }

    const posts = await prisma.post.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.post.count({ where })

    return NextResponse.json({
      posts: posts.map((post) => ({
        ...post,
        commentCount: post._count.comments,
        likesCount: post._count.likes,
        bookmarksCount: post._count.bookmarks,
      })),
      hasMore: posts.length === limit,
      nextPage: posts.length === limit ? page + 1 : undefined,
      total,
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, images, category, ageGroup, tags } = await request.json()

    // Assuming 'auth' is available in this scope, e.g., from middleware
    // and 'auth.user!.id' contains the authenticated user's ID.
    // If 'auth' is not available, you'll need to implement the authentication
    // logic to retrieve the user's ID.

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Make sure auth and auth.user are valid before accessing auth.user!.id
    // Example:  if (!auth || !auth.user || !auth.user.id) { ... }
    // For this example, assuming auth is available for brevity
    const post = await prisma.post.create({
      data: {
        content,
        images: images || [],
        category,
        ageGroup,
        tags: tags || [],
        authorId: auth.user!.id,
      },
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
    })

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        commentCount: post._count.comments,
        likesCount: post._count.likes,
        bookmarksCount: post._count.bookmarks,
      },
    })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}