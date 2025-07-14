import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

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