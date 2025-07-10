import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const ageGroup = searchParams.get("ageGroup")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const where: any = {}
    if (category && category !== "all" && typeof category === "string") {
      where.category = category.toUpperCase()
    }
    if (ageGroup && ageGroup !== "all" && typeof ageGroup === "string") {
      where.ageGroup = ageGroup.toUpperCase().replace('-', '_')
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
        likes: currentUserId ? {
          where: {
            userId: currentUserId
          }
        } : false,
        bookmarks: currentUserId ? {
          where: {
            userId: currentUserId
          }
        } : false,
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

    // 현재 로그인한 사용자 ID를 쿠키에서 가져오기
    const cookies = request.headers.get('cookie') || ''
    const userCookie = cookies.split(';').find(c => c.trim().startsWith('user='))
    let currentUserId = null
    
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
        currentUserId = userData.id
      } catch (error) {
        console.log('Failed to parse user cookie:', error)
      }
    }

    // 게시글 데이터 변환
    const transformedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      images: post.images,
      category: post.category,
      ageGroup: post.ageGroup,
      tags: post.tags,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      bookmarksCount: post._count.bookmarks,
      viewsCount: post.viewsCount,
      isLiked: currentUserId ? (post.likes && post.likes.length > 0) : false,
      isBookmarked: currentUserId ? (post.bookmarks && post.bookmarks.length > 0) : false
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      authorId: post.authorId,
      isPublished: post.isPublished,
      isPinned: post.isPinned || false,
      author: {
        id: post.author.id,
        nickname: post.author.nickname,
        avatar: post.author.avatar,
      },
    }))

    return NextResponse.json({
      posts: transformedPosts,
      total,
      page,
      limit,
      hasMore: (page - 1) * limit + posts.length < total,
      nextPage: (page - 1) * limit + posts.length < total ? page + 1 : null,
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export const POST = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { content, images, category, ageGroup, tags } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        content,
        images: images || [],
        category: category.toUpperCase(),
        ageGroup: ageGroup.toUpperCase().replace('-', '_'),
        tags: tags || [],
        authorId: auth.user.id,
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
})