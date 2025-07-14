import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const PUT = withAuth(async (
  request: NextRequest,
  auth: { user: any },
  { params }: { params: { id: string } }
) => {
  try {
    const commentId = params.id
    const body = await request.json()
    const { content } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "댓글 내용이 필요합니다" }, { status: 400 })
    }

    // 댓글 존재 여부 및 작성자 확인
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true }
    })

    if (!existingComment) {
      return NextResponse.json({ error: "댓글을 찾을 수 없습니다" }, { status: 404 })
    }

    // 작성자 본인만 수정 가능
    if (existingComment.authorId !== auth.user.id) {
      return NextResponse.json({ error: "수정 권한이 없습니다" }, { status: 403 })
    }

    // 댓글 수정
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    })

    // 좋아요 상태 확인
    const userLike = await prisma.like.findFirst({
      where: {
        userId: auth.user.id,
        commentId: commentId,
      }
    })

    const responseComment = {
      id: updatedComment.id,
      content: updatedComment.content,
      postId: updatedComment.postId,
      parentId: updatedComment.parentId,
      author: updatedComment.author,
      likesCount: updatedComment._count.likes,
      isLiked: !!userLike,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
      replies: []
    }

    return NextResponse.json({
      success: true,
      comment: responseComment
    })
  } catch (error) {
    console.error("댓글 수정 오류:", error)
    return NextResponse.json({ error: "댓글 수정 중 오류가 발생했습니다" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (
  request: NextRequest,
  auth: { user: any },
  { params }: { params: { id: string } }
) => {
  try {
    const commentId = params.id

    // 댓글 존재 여부 및 작성자 확인
    const commentToDelete = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, postId: true }
    })

    if (!commentToDelete) {
      return NextResponse.json({ error: "댓글을 찾을 수 없습니다" }, { status: 404 })
    }

    // 작성자 본인만 삭제 가능
    if (commentToDelete.authorId !== auth.user.id) {
      return NextResponse.json({ error: "삭제 권한이 없습니다" }, { status: 403 })
    }

    let totalCommentsDeleted = 0; // 삭제된 전체 댓글 수를 추적

    // 댓글과 모든 하위 대댓글을 재귀적으로 삭제하는 함수
    const deleteCommentAndAllReplies = async (currentCommentId: string) => {
      // 현재 댓글의 모든 직접적인 대댓글을 찾습니다.
      const replies = await prisma.comment.findMany({
        where: { parentId: currentCommentId },
        select: { id: true }
      });

      // 각 대댓글에 대해 재귀적으로 함수를 호출하여 하위 대댓글부터 삭제합니다.
      for (const reply of replies) {
        await deleteCommentAndAllReplies(reply.id);
      }

      // 모든 하위 대댓글이 삭제된 후, 현재 댓글을 삭제합니다.
      await prisma.comment.delete({
        where: { id: currentCommentId }
      });
      totalCommentsDeleted++; // 삭제된 댓글 수 증가
    };

    // 최상위 댓글부터 삭제 프로세스 시작
    await deleteCommentAndAllReplies(commentId);

    // 게시글의 commentsCount 업데이트
    if (commentToDelete.postId) {
      await prisma.post.update({
        where: { id: commentToDelete.postId },
        data: {
          commentsCount: {
            decrement: totalCommentsDeleted, // 삭제된 모든 댓글 수만큼 감소
          },
        },
      });
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "댓글 삭제에 실패했습니다" }, { status: 500 })
  }
})