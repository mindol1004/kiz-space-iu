
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth-utils';
import { z } from 'zod';

const getMessagesSchema = z.object({
  cursor: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const user = await getUserFromCookies(req);
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const validation = getMessagesSchema.safeParse({
      cursor: searchParams.get('cursor') || undefined,
    });

    if (!validation.success) {
      return NextResponse.json({ error: '잘못된 입력입니다.' }, { status: 400 });
    }

    const { cursor } = validation.data;
    const limit = 20;

    // 사용자가 해당 채팅방의 참여자인지 확인
    const participant = await prisma.chatParticipant.findFirst({
        where: {
            chatRoomId: params.roomId,
            userId: user.id,
        }
    });

    if (!participant) {
        return NextResponse.json({ error: '채팅방에 접근할 권한이 없습니다.' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: {
        chatRoomId: params.roomId,
      },
      take: limit + 1, // 다음 페이지 존재 여부 확인을 위해 1개 더 가져옴
      ...(cursor && {
        cursor: {
          id: cursor,
        },
      }),
      include: {
        sender: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let nextCursor: string | undefined = undefined;
    if (messages.length > limit) {
      const nextItem = messages.pop(); // 마지막 아이템을 다음 커서로 사용
      nextCursor = nextItem!.id;
    }

    return NextResponse.json({
      messages,
      nextCursor,
    });
  } catch (error) {
    console.error(`메시지 조회 오류 (Room: ${params.roomId}):`, error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
