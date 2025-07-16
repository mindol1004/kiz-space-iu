
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromCookies } from '@/lib/auth-utils';
import { z } from 'zod';

const sendMessageSchema = z.object({
  content: z.string().min(1, '메시지는 비워둘 수 없습니다.').max(1000, '메시지는 1000자를 넘을 수 없습니다.'),
});

export async function POST(req: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const user = await getUserFromCookies(req);
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const body = await req.json();
    const validation = sendMessageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { content } = validation.data;
    const { roomId } = params;

    // 사용자가 해당 채팅방의 참여자인지 확인
    const participant = await prisma.chatParticipant.findFirst({
        where: {
            chatRoomId: roomId,
            userId: user.id,
        }
    });

    if (!participant) {
        return NextResponse.json({ error: '메시지를 보낼 권한이 없습니다.' }, { status: 403 });
    }
    
    // 데이터베이스 트랜잭션 시작
    const [message] = await prisma.$transaction([
      // 1. 새 메시지 생성
      prisma.message.create({
        data: {
          chatRoomId: roomId,
          senderId: user.id,
          content: content,
        },
        include: {
          sender: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
        },
      }),
      // 2. 채팅방 정보 업데이트 (마지막 메시지, 시간)
      prisma.chatRoom.update({
        where: { id: roomId },
        data: {
          updatedAt: new Date(),
          lastMessageContent: content,
          lastMessageAt: new Date(),
        },
      }),
      // 3. 다른 참여자들의 unreadCount 증가
      prisma.chatParticipant.updateMany({
        where: {
            chatRoomId: roomId,
            userId: {
                not: user.id
            }
        },
        data: {
            unreadCount: {
                increment: 1
            }
        }
      })
    ]);

    // TODO: 실시간 푸시 알림 구현 (예: WebSocket, Pusher)

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error(`메시지 전송 오류 (Room: ${params.roomId}):`, error);
    return NextResponse.json({ error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
  }
}
