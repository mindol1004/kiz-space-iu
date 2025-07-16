
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth-utils';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getUserFromCookies(request);
    if (!currentUser) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const targetUserId = params.id;

    if (currentUser.id === targetUserId) {
      return NextResponse.json({ error: '자신을 팔로우할 수 없습니다.' }, { status: 400 });
    }

    // 이미 팔로우하고 있는지 확인
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json({ message: '이미 팔로우하고 있는 사용자입니다.' }, { status: 200 });
    }

    // 팔로우 관계 생성
    await prisma.follow.create({
      data: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    });

    // 팔로워/팔로잉 카운트 업데이트 (트랜잭션으로 처리하여 원자성 보장)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: currentUser.id },
        data: { followingCount: { increment: 1 } },
      }),
      prisma.user.update({
        where: { id: targetUserId },
        data: { followersCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ message: '성공적으로 팔로우했습니다.' }, { status: 201 });
  } catch (error) {
    console.error('팔로우 처리 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentUser = await getUserFromCookies(request);
    if (!currentUser) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const targetUserId = params.id;

    // 팔로우 관계가 존재하는지 확인
    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUser.id,
                followingId: targetUserId,
            },
        },
    });

    if (!existingFollow) {
        return NextResponse.json({ message: '팔로우하고 있지 않은 사용자입니다.' }, { status: 404 });
    }

    // 팔로우 관계 삭제
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUserId,
        },
      },
    });
    
    // 팔로워/팔로잉 카운트 업데이트
    await prisma.$transaction([
        prisma.user.update({
            where: { id: currentUser.id },
            data: { followingCount: { decrement: 1 } },
        }),
        prisma.user.update({
            where: { id: targetUserId },
            data: { followersCount: { decrement: 1 } },
        }),
    ]);

    return NextResponse.json({ message: '성공적으로 언팔로우했습니다.' }, { status: 200 });
  } catch (error) {
    console.error('언팔로우 처리 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
