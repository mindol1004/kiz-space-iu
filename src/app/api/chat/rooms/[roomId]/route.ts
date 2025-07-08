import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const { roomId } = params

    // 그룹 채팅방인지 확인
    const group = await prisma.group.findUnique({
      where: { id: roomId },
      include: {
        members: {
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
        _count: {
          select: {
            members: true,
          },
        },
      },
    })

    if (group) {
      // 그룹 채팅방 정보 반환
      return NextResponse.json({
        id: group.id,
        name: group.name,
        type: "group",
        lastMessage: "마지막 메시지", // 실제로는 최근 메시지 조회
        lastMessageTime: "방금 전",
        unreadCount: 0, // 실제로는 읽지 않은 메시지 수 계산
        participants: group._count.members,
        avatar: group.image,
        isOnline: true,
      })
    }

    // 개인 채팅방인 경우 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: roomId },
      select: {
        id: true,
        nickname: true,
        avatar: true,
        isOnline: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Chat room not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.nickname,
      type: "direct",
      lastMessage: "마지막 메시지", // 실제로는 최근 메시지 조회
      lastMessageTime: "방금 전",
      unreadCount: 0, // 실제로는 읽지 않은 메시지 수 계산
      participants: 2,
      avatar: user.avatar,
      isOnline: user.isOnline,
    })
  } catch (error) {
    console.error("Error fetching chat room:", error)
    return NextResponse.json({ error: "Failed to fetch chat room" }, { status: 500 })
  }
}
