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
            likes: currentUserId ? {
              where: {
                userId: currentUserId
              }
            } : false,
            _count: {
              select: {
                likes: true
              }
            }
          },
          orderBy: { createdAt: "asc" }
        },
        likes: currentUserId ? {
          where: {
            userId: currentUserId
          }
        } : false,
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
        isLiked: currentUserId ? (comment.likes && comment.likes.length > 0) : false,
        replies: comment.replies.map(reply => ({
          ...reply,
          likesCount: reply._count.likes,
          isLiked: currentUserId ? (reply.likes && reply.likes.length > 0) : false
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
        repliesCount: comment._count.replies,
        isLiked: false
      }
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "댓글 생성에 실패했습니다" }, { status: 500 })
  }
})