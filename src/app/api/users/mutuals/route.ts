
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getUserFromCookies(request);
    if (!currentUser) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    // 1. 내가 팔로우하는 모든 사용자의 ID 목록을 가져옵니다.
    const iFollow = await prisma.follow.findMany({
      where: { followerId: currentUser.id },
      select: { followingId: true },
    });
    const iFollowIds = iFollow.map(f => f.followingId);

    // 2. 나를 팔로우하는 사용자 중에서, 내가 팔로우하는 사용자와 일치하는 사람을 찾습니다.
    const mutualFollows = await prisma.follow.findMany({
      where: {
        followingId: currentUser.id, // 나를 팔로우하고
        followerId: { in: iFollowIds }, // 그 사람이 내가 팔로우하는 목록에 포함된 경우
      },
      include: {
        follower: { // 해당 팔로워(상대방)의 정보를 가져옵니다.
          select: {
            id: true,
            nickname: true,
            avatar: true,
          }
        }
      }
    });

    const mutualUsers = mutualFollows.map(f => f.follower);

    return NextResponse.json(mutualUsers);
  } catch (error) {
    console.error('상호 팔로우 사용자 목록 조회 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
