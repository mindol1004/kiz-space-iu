
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const POST = withAuth(async (
  request: NextRequest,
  auth: { user: any },
  { params }: { params: { id: string } }
) => {
  try {
    const { id: followingId } = params

    if (auth.user.id === followingId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: followingId },
    })

    if (!userToFollow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: auth.user.id,
          followingId,
        },
      },
    })

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      })

      // Update counts
      await prisma.$transaction([
        prisma.user.update({
          where: { id: auth.user.id },
          data: { followingCount: { decrement: 1 } },
        }),
        prisma.user.update({
          where: { id: followingId },
          data: { followersCount: { decrement: 1 } },
        }),
      ])

      return NextResponse.json({
        success: true,
        following: false,
        message: "Unfollowed user",
      })
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: auth.user.id,
          followingId,
        },
      })

      // Update counts
      await prisma.$transaction([
        prisma.user.update({
          where: { id: auth.user.id },
          data: { followingCount: { increment: 1 } },
        }),
        prisma.user.update({
          where: { id: followingId },
          data: { followersCount: { increment: 1 } },
        }),
      ])

      return NextResponse.json({
        success: true,
        following: true,
        message: "Followed user",
      })
    }
  } catch (error) {
    console.error("Error toggling follow:", error)
    return NextResponse.json({ error: "Failed to toggle follow" }, { status: 500 })
  }
})
