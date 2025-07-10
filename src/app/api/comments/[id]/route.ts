
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
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, postId: true }
    })

    if (!comment) {
      return NextResponse.json({ error: "댓글을 찾을 수 없습니다" }, { status: 404 })
    }

    // 작성자 본인만 삭제 가능
    if (comment.authorId !== auth.user.id) {
      return NextResponse.json({ error: "삭제 권한이 없습니다" }, { status: 403 })
    }

    // 댓글 삭제 (대댓글도 함께 삭제)
    await prisma.comment.deleteMany({
      where: {
        OR: [
          { id: commentId },
          { parentId: commentId }
        ]
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "댓글 삭제에 실패했습니다" }, { status: 500 })
  }
})
