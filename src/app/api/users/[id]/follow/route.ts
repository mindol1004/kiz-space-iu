import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const followerId = getUserIdFromCookies(request)
    const followingId = params.id

    if (!followerId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    if (!followingId) {
      return NextResponse.json({ error: "사용자 ID가 필요합니다" }, { status: 400 })
    }

    if (followerId === followingId) {
      return NextResponse.json({ error: "자기 자신을 팔로우할 수 없습니다" }, { status: 400 })
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    })

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: followingId,
          },
        },
      })

      // Update follower count
      await prisma.user.update({
        where: { id: followingId },
        data: {
          followersCount: {
            decrement: 1,
          },
        },
      })

      // Update following count
      await prisma.user.update({
        where: { id: followerId },
        data: {
          followingCount: {
            decrement: 1,
          },
        },
      })

      return NextResponse.json({
        success: true,
        isFollowing: false,
        message: "언팔로우했습니다",
      })
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: followerId,
          followingId: followingId,
        },
      })

      // Update follower count
      await prisma.user.update({
        where: { id: followingId },
        data: {
          followersCount: {
            increment: 1,
          },
        },
      })

      // Update following count
      await prisma.user.update({
        where: { id: followerId },
        data: {
          followingCount: {
            increment: 1,
          },
        },
      })

      return NextResponse.json({
        success: true,
        isFollowing: true,
        message: "팔로우했습니다",
      })
    }
  } catch (error) {
    console.error("Error toggling follow:", error)
    return NextResponse.json({ error: "팔로우 처리에 실패했습니다" }, { status: 500 })
  }
}