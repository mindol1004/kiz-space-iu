
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const GET = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        replies: {
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
                likes: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.comment.count({
      where: {
        postId,
        parentId: null,
      },
    })

    return NextResponse.json({
      comments: comments.map((comment) => ({
        ...comment,
        likesCount: comment._count.likes,
        repliesCount: comment._count.replies,
        replies: comment.replies.map((reply) => ({
          ...reply,
          likesCount: reply._count.likes,
        })),
      })),
      hasMore: comments.length === limit,
      nextPage: comments.length === limit ? page + 1 : undefined,
      total,
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { postId, content, parentId } = await request.json()

    if (!postId || !content) {
      return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 })
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      })

      if (!parentComment) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 })
      }
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: auth.user.id,
        content,
        parentId,
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
            likes: true,
            replies: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      comment: {
        ...comment,
        likesCount: comment._count.likes,
        repliesCount: comment._count.replies,
      },
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
})
