
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = params.id

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            verified: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
                verified: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    nickname: true,
                    avatar: true,
                    verified: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        bookmarks: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
            views: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "게시글을 가져오는데 실패했습니다" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = params.id
    const userId = getUserIdFromCookies(request)

    if (!userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 })
    }

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    const { content, category, ageGroup, tags, images } = await request.json()

    // 작성자 확인
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    })

    if (!existingPost) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 })
    }

    if (existingPost.authorId !== userId) {
      return NextResponse.json({ error: "수정 권한이 없습니다" }, { status: 403 })
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content,
        category,
        ageGroup,
        tags,
        images,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            verified: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
            views: true,
          },
        },
      },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "게시글 수정에 실패했습니다" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = params.id
    const userId = getUserIdFromCookies(request)

    if (!userId) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 })
    }

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    // 작성자 확인
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    })

    if (!existingPost) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 })
    }

    if (existingPost.authorId !== userId) {
      return NextResponse.json({ error: "삭제 권한이 없습니다" }, { status: 403 })
    }

    // 관련 데이터 삭제 (Cascade 삭제로 자동 처리되지만 명시적으로 처리)
    await prisma.$transaction(async (tx) => {
      // 댓글의 좋아요 삭제
      await tx.like.deleteMany({
        where: {
          comment: {
            postId: postId
          }
        }
      })

      // 댓글 삭제
      await tx.comment.deleteMany({
        where: { postId: postId }
      })

      // 게시글의 좋아요 삭제
      await tx.like.deleteMany({
        where: { postId: postId }
      })

      // 북마크 삭제
      await tx.bookmark.deleteMany({
        where: { postId: postId }
      })

      // 조회 기록 삭제
      await tx.postView.deleteMany({
        where: { postId: postId }
      })

      // 게시글 삭제
      await tx.post.delete({
        where: { id: postId }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "게시글 삭제에 실패했습니다" }, { status: 500 })
  }
}
