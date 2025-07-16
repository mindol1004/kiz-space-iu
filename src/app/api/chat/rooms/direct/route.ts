
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth-utils';
import { z } from 'zod';

const createDirectChatSchema = z.object({
  targetUserId: z.string().nonempty(),
});

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getUserFromCookies(request);
    if (!currentUser) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createDirectChatSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { targetUserId } = validation.data;

    if (currentUser.id === targetUserId) {
        return NextResponse.json({ error: '자신과는 채팅방을 만들 수 없습니다.' }, { status: 400 });
    }

    // 1. 이미 두 사용자 간의 DIRECT 채팅방이 있는지 확인합니다.
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          { participants: { some: { userId: currentUser.id } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
    });

    if (existingRoom) {
      return NextResponse.json(existingRoom);
    }

    // 2. 새 채팅방을 생성합니다.
    const newRoom = await prisma.chatRoom.create({
      data: {
        type: 'DIRECT',
        name: `DM with ${targetUserId}`, // 이름은 나중에 클라이언트에서 상대방 닉네임으로 표시
        participants: {
          create: [
            { userId: currentUser.id, role: 'MEMBER' },
            { userId: targetUserId, role: 'MEMBER' },
          ],
        },
      },
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error('1:1 채팅방 생성 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
