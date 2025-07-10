import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"
import { withAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const currentUserId = getUserIdFromCookies(request)

    if (!userId) {
      return NextResponse.json({ error: "사용자 ID가 필요합니다" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        avatar: true,
        bio: true,
        location: true,
        interests: true,
        verified: true,
        postsCount: true,
        followersCount: true,
        followingCount: true,
        createdAt: true,
        followers: currentUserId ? {
          where: {
            followerId: currentUserId
          }
        } : false,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다" }, { status: 404 })
    }

    const userWithFollowStatus = {
      ...user,
      isFollowing: currentUserId ? (user.followers && user.followers.length > 0) : false,
      followers: undefined, // Remove followers from response
    }

    return NextResponse.json({ user: userWithFollowStatus })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "사용자 정보를 불러오는데 실패했습니다" }, { status: 500 })
  }
}

export const PUT = withAuth(async (request: NextRequest, auth: { user: any }, { params }: { params: { id: string } }) => {
  try {
    // 자신의 프로필만 수정 가능
    if (params.id !== auth.user.id) {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 })
    }

    const { nickname, avatar, location, interests, bio } = await request.json()

    const updateData: any = {}
    if (nickname !== undefined) updateData.nickname = nickname
    if (avatar !== undefined) updateData.avatar = avatar
    if (location !== undefined) updateData.location = location
    if (interests !== undefined) updateData.interests = interests
    if (bio !== undefined) updateData.bio = bio

    const user = await prisma.user.update({
      where: {
        id: params.id
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        location: true,
        interests: true,
        verified: true,
        bio: true,
        postsCount: true,
        followersCount: true,
        followingCount: true,
        createdAt: true,
        lastSeenAt: true
      }
    })

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "프로필 수정에 실패했습니다" }, { status: 500 })
  }
})