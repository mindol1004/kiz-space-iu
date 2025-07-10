
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()
    const postId = params.id

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    // 같은 유저가 이미 조회했는지 확인
    if (userId) {
      const existingView = await prisma.postView.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      })

      // 이미 조회한 경우 조회수 증가하지 않음
      if (existingView) {
        const post = await prisma.post.findUnique({
          where: { id: postId },
          select: { viewsCount: true },
        })
        return NextResponse.json({
          success: true,
          viewsCount: post?.viewsCount || 0,
          message: "Already viewed",
        })
      }

      // 새로운 조회 기록 생성
      await prisma.postView.create({
        data: {
          userId,
          postId,
        },
      })
    }

    // 조회수 증가
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
      select: { viewsCount: true },
    })

    return NextResponse.json({
      success: true,
      viewsCount: updatedPost.viewsCount,
      message: "Views incremented",
    })
  } catch (error) {
    console.error("Error incrementing views:", error)
    return NextResponse.json({ error: "Failed to increment views" }, { status: 500 })
  }
}
