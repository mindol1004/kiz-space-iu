

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const POST = withAuth(async (
  request: NextRequest,
  auth: { user: any },
  { params }: { params: { id: string } }
) => {
  try {
    const commentId = params.id

    // 댓글 존재 여부 확인
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    })

    if (!comment) {
      return NextResponse.json({ error: "댓글을 찾을 수 없습니다" }, { status: 404 })
    }

    // 기존 좋아요 확인
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: auth.user.id,
        commentId: commentId
      }
    })

    let liked: boolean
    let likesCount: number

    if (existingLike) {
      // 좋아요 취소
      await prisma.like.delete({
        where: { id: existingLike.id }
      })
      liked = false
    } else {
      // 좋아요 추가
      await prisma.like.create({
        data: {
          userId: auth.user.id,
          commentId: commentId
        }
      })
      liked = true
    }

    // 총 좋아요 수 계산
    likesCount = await prisma.like.count({
      where: { commentId: commentId }
    })

    // 댓글의 likesCount 업데이트
    await prisma.comment.update({
      where: { id: commentId },
      data: { likesCount: likesCount }
    })

    return NextResponse.json({ 
      success: true, 
      liked, 
      likesCount 
    })
  } catch (error) {
    console.error("Error toggling comment like:", error)
    return NextResponse.json({ error: "좋아요 처리에 실패했습니다" }, { status: 500 })
  }
})
