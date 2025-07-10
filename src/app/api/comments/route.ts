
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null // 최상위 댓글만
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        },
        replies: {
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
                likes: true
              }
            }
          },
          orderBy: { createdAt: "asc" }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.comment.count({
      where: {
        postId,
        parentId: null
      }
    })

    return NextResponse.json({
      comments: comments.map(comment => ({
        ...comment,
        likesCount: comment._count.likes,
        repliesCount: comment._count.replies,
        replies: comment.replies.map(reply => ({
          ...reply,
          likesCount: reply._count.likes
        }))
      })),
      hasMore: comments.length === limit,
      nextPage: comments.length === limit ? page + 1 : undefined,
      total
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "댓글을 불러오는데 실패했습니다" }, { status: 500 })
  }
}

export const POST = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { postId, content, parentId } = await request.json()

    if (!postId || !content) {
      return NextResponse.json({ error: "포스트 ID와 내용이 필요합니다" }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: auth.user.id,
        content,
        parentId: parentId || null
      },
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
            likes: true,
            replies: true
          }
        }
      }
    })

    // 포스트의 댓글 카운트 업데이트
    await prisma.post.update({
      where: { id: postId },
      data: {
        commentsCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      comment: {
        ...comment,
        likesCount: comment._count.likes,
        repliesCount: comment._count.replies
      }
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "댓글 생성에 실패했습니다" }, { status: 500 })
  }
})
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export const POST = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { content, postId, parentId } = await request.json()

    if (!content || !postId) {
      return NextResponse.json({ error: "Content and postId are required" }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: auth.user.id,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, comment })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
})
