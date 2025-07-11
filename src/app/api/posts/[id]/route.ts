
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
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다" }, { status: 404 })
    }

    return NextResponse.json({
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      bookmarksCount: post._count.bookmarks,
    })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "포스트 조회에 실패했습니다" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getUserIdFromCookies(request)
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const postId = params.id

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    // 포스트 권한 확인
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    })

    if (!post) {
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다" }, { status: 404 })
    }

    if (post.authorId !== userId) {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 })
    }

    // 트랜잭션으로 관련 데이터 순차적 삭제
    await prisma.$transaction(async (tx) => {
      // 1. 먼저 대댓글(replies) 삭제
      await tx.comment.deleteMany({
        where: {
          postId: postId,
          parentId: { not: null }, // 대댓글만 삭제
        },
      })

      // 2. 부모 댓글 삭제
      await tx.comment.deleteMany({
        where: {
          postId: postId,
          parentId: null, // 부모 댓글만 삭제
        },
      })

      // 3. 좋아요 삭제
      await tx.like.deleteMany({
        where: { postId: postId },
      })

      // 4. 북마크 삭제
      await tx.bookmark.deleteMany({
        where: { postId: postId },
      })

      // 5. 조회 기록 삭제
      await tx.postView.deleteMany({
        where: { postId: postId },
      })

      // 6. 신고 삭제
      await tx.report.deleteMany({
        where: { postId: postId },
      })

      // 7. 마지막으로 포스트 삭제
      await tx.post.delete({
        where: { id: postId },
      })
    })

    return NextResponse.json({ success: true, message: "포스트가 삭제되었습니다" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "포스트 삭제에 실패했습니다" }, { status: 500 })
  }
}
