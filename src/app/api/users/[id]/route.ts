import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"
import { withAuth } from "@/lib/auth-middleware"
import { z } from "zod"

const userUpdateSchema = z.object({
    nickname: z.string().min(2, "닉네임은 2자 이상이어야 합니다.").optional(),
    avatar: z.string().url("유효한 URL이 아닙니다.").optional(),
    location: z.string().optional(),
    interests: z.array(z.string()).optional(),
    bio: z.string().max(200, "소개는 200자를 넘을 수 없습니다.").optional(),
});


/**
 * 관심사(태그) 변경을 처리하는 헬퍼 함수
 * @param oldTags - 사용자의 기존 관심사 배열
 * @param newTags - 사용자의 새로운 관심사 배열
 */
async function handleInterestTagsChange(oldTags: string[], newTags: string[]) {
  const tagsToRemove = oldTags.filter(tag => !newTags.includes(tag));
  const tagsToAdd = newTags.filter(tag => !oldTags.includes(tag));

  // 사라진 태그 카운트 감소
  if (tagsToRemove.length > 0) {
    await prisma.tag.updateMany({
      where: { name: { in: tagsToRemove } },
      data: { usageCount: { decrement: 1 } },
    });
  }

  // 추가된 태그 카운트 증가 (upsert 사용)
  if (tagsToAdd.length > 0) {
    await Promise.all(
      tagsToAdd.map(tagName => 
        prisma.tag.upsert({
          where: { name: tagName },
          update: { usageCount: { increment: 1 } },
          create: { name: tagName, usageCount: 1 },
        })
      )
    );
  }
}


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

    const body = await request.json();
    const validation = userUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { interests, ...updateData } = validation.data;
    
    // --- 관심사 태그 처리 로직 추가 ---
    if (interests) {
        const currentUser = await prisma.user.findUnique({
            where: { id: auth.user.id },
            select: { interests: true }
        });
        const oldInterests = currentUser?.interests || [];
        await handleInterestTagsChange(oldInterests, interests);
    }
    // ------------------------------------

    const user = await prisma.user.update({
      where: {
        id: params.id
      },
      data: {
        ...updateData,
        interests // 업데이트된 관심사 정보 저장
      },
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