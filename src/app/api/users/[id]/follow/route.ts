import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { followerId } = await request.json()

    if (!followerId) {
      return NextResponse.json({ error: "Follower ID is required" }, { status: 400 })
    }

    // 이미 팔로우 중인지 확인
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: params.id,
        },
      },
    })

    let isFollowing = false

    if (existingFollow) {
      // 언팔로우
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId: params.id,
          },
        },
      })
      isFollowing = false
    } else {
      // 팔로우
      await prisma.follow.create({
        data: {
          followerId,
          followingId: params.id,
        },
      })
      isFollowing = true
    }

    return NextResponse.json({
      success: true,
      isFollowing,
      message: isFollowing ? "Successfully followed user" : "Successfully unfollowed user",
    })
  } catch (error) {
    console.error("Error following/unfollowing user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
