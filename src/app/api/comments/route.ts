
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    // 현재 로그인한 사용자 ID 가져오기
    const currentUserId = getUserIdFromCookies(request)

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
        parentId: null, // 최상위 댓글만
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
            likes: currentUserId ? {
              where: {
                userId: currentUserId
              }
            } : false,
            _count: {
              select: {
                likes: true,
                replies: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: currentUserId ? {
          where: {
            userId: currentUserId
          }
        } : false,
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
        postId: postId,
        parentId: null,
      },
    })

    // 사용자별 좋아요 상태 추가
    const commentsWithLikeStatus = comments.map(comment => ({
      ...comment,
      isLiked: currentUserId ? comment.likes.length > 0 : false,
      repliesCount: comment._count.replies,
      replies: comment.replies.map(reply => ({
        ...reply,
        isLiked: currentUserId ? reply.likes.length > 0 : false,
        repliesCount: reply._count.replies,
      })),
    }))

    return NextResponse.json({
      comments: commentsWithLikeStatus,
      hasMore: total > page * limit,
      nextPage: total > page * limit ? page + 1 : undefined,
      total,
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "댓글을 불러오는데 실패했습니다" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromCookies(request)
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const { postId, content, parentId } = await request.json()

    if (!postId || !content) {
      return NextResponse.json({ error: "포스트 ID와 내용이 필요합니다" }, { status: 400 })
    }

    const comment = await prisma.comment.create({
      data: {
        postId: postId,
        authorId: userId,
        content: content.trim(),
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
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    })

    // Update post comment count
    await prisma.post.update({
      where: { id: postId },
      data: {
        commentsCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({
      comment: {
        ...comment,
        isLiked: false,
        repliesCount: comment._count.replies,
      }
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "댓글 작성에 실패했습니다" }, { status: 500 })
  }
}
