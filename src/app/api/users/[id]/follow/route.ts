
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const POST = withAuth(async (request: NextRequest, auth: { user: any }, { params }: { params: { id: string } }) => {
  try {
    const targetUserId = params.id

    if (targetUserId === auth.user.id) {
      return NextResponse.json({ error: "자기 자신을 팔로우할 수 없습니다" }, { status: 400 })
    }

    // 대상 사용자 존재 확인
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    })

    if (!targetUser) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다" }, { status: 404 })
    }

    // 이미 팔로우하고 있는지 확인
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: auth.user.id,
          followingId: targetUserId
        }
      }
    })

    if (existingFollow) {
      return NextResponse.json({ error: "이미 팔로우하고 있습니다" }, { status: 409 })
    }

    // 팔로우 생성
    await prisma.follow.create({
      data: {
        followerId: auth.user.id,
        followingId: targetUserId
      }
    })

    // 카운트 업데이트
    await prisma.$transaction([
      prisma.user.update({
        where: { id: auth.user.id },
        data: { followingCount: { increment: 1 } }
      }),
      prisma.user.update({
        where: { id: targetUserId },
        data: { followersCount: { increment: 1 } }
      })
    ])

    return NextResponse.json({
      success: true,
      message: "팔로우했습니다"
    })
  } catch (error) {
    console.error("Error following user:", error)
    return NextResponse.json({ error: "팔로우에 실패했습니다" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (request: NextRequest, auth: { user: any }, { params }: { params: { id: string } }) => {
  try {
    const targetUserId = params.id

    // 팔로우 관계 찾기
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: auth.user.id,
          followingId: targetUserId
        }
      }
    })

    if (!existingFollow) {
      return NextResponse.json({ error: "팔로우하고 있지 않습니다" }, { status: 404 })
    }

    // 언팔로우
    await prisma.follow.delete({
      where: {
        id: existingFollow.id
      }
    })

    // 카운트 업데이트
    await prisma.$transaction([
      prisma.user.update({
        where: { id: auth.user.id },
        data: { followingCount: { decrement: 1 } }
      }),
      prisma.user.update({
        where: { id: targetUserId },
        data: { followersCount: { decrement: 1 } }
      })
    ])

    return NextResponse.json({
      success: true,
      message: "언팔로우했습니다"
    })
  } catch (error) {
    console.error("Error unfollowing user:", error)
    return NextResponse.json({ error: "언팔로우에 실패했습니다" }, { status: 500 })
  }
})
