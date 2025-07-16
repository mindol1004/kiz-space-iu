
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth-utils';
import { z } from 'zod';

const createGroupChatSchema = z.object({
  name: z.string().min(1, '그룹 채팅 이름은 비워둘 수 없습니다.').max(50, '이름은 50자를 넘을 수 없습니다.'),
  participantIds: z.array(z.string()).min(2, '그룹 채팅은 최소 3명 이상이어야 합니다.'),
});

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getUserFromCookies(request);
    if (!currentUser) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const body = await request.json();
    const validation = createGroupChatSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { name, participantIds } = validation.data;

    // 현재 사용자가 참여자에 포함되어 있는지 확인하고, 중복을 제거합니다.
    const allParticipantIds = [...new Set([currentUser.id, ...participantIds])];

    if (allParticipantIds.length < 3) {
        return NextResponse.json({ error: '그룹 채팅은 최소 3명 이상이어야 합니다.' }, { status: 400 });
    }

    const newRoom = await prisma.chatRoom.create({
      data: {
        type: 'GROUP',
        name,
        participants: {
          create: allParticipantIds.map(userId => ({
            userId: userId,
            role: userId === currentUser.id ? 'ADMIN' : 'MEMBER',
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, nickname: true, avatar: true }
            }
          }
        }
      }
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error('그룹 채팅방 생성 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
