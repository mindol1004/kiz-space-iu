import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        comments: {
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
        },
        _count: {
          select: {
            likes: true,
            bookmarks: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = params.id

    // 게시글 존재 여부 확인
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true }
    })

    if (!post) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 })
    }

    // 트랜잭션으로 연관된 데이터들을 모두 삭제
    await prisma.$transaction(async (tx) => {
      // 1. 댓글의 좋아요 삭제
      await tx.like.deleteMany({
        where: {
          comment: {
            postId: postId
          }
        }
      })

      // 2. 댓글들 삭제 (대댓글 포함)
      await tx.comment.deleteMany({
        where: { postId: postId }
      })

      // 3. 게시글 좋아요 삭제
      await tx.like.deleteMany({
        where: { postId: postId }
      })

      // 4. 게시글 북마크 삭제
      await tx.bookmark.deleteMany({
        where: { postId: postId }
      })

      // 5. 게시글 조회 기록 삭제
      await tx.postView.deleteMany({
        where: { postId: postId }
      })

      // 6. 게시글 신고 삭제
      await tx.report.deleteMany({
        where: { postId: postId }
      })

      // 7. 마지막으로 게시글 삭제
      await tx.post.delete({
        where: { id: postId }
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
