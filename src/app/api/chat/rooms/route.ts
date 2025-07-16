
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookies(request);
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const formattedRooms = chatRooms.map((room) => {
      const otherParticipant = room.participants.find((p) => p.userId !== user.id);
      const lastMessage = room.messages[0];
      const unreadCount = room.participants.find((p) => p.userId === user.id)?.unreadCount ?? 0;

      return {
        id: room.id,
        name: room.type === 'DIRECT' && otherParticipant ? otherParticipant.user.nickname : room.name,
        avatar: room.type === 'DIRECT' && otherParticipant ? otherParticipant.user.avatar : room.avatar,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
        } : null,
        unreadCount,
        updatedAt: room.updatedAt,
        type: room.type, // 채팅방 타입을 추가합니다.
        participantsCount: room.participants.length, // 참여자 수를 추가합니다.
      };
    });

    return NextResponse.json(formattedRooms);
  } catch (error) {
    console.error('채팅방 목록 조회 오류:', error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
