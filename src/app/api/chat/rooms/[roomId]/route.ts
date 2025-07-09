import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const GET = withAuth(async (request: NextRequest, auth: { user: any }, { params }: { params: { roomId: string } }) => {
  try {
    const chatRoom = await prisma.chatRoom.findUnique({
      where: {
        id: params.roomId
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    if (!chatRoom) {
      return NextResponse.json({ error: "채팅방을 찾을 수 없습니다" }, { status: 404 })
    }

    // 참여자인지 확인
    const isParticipant = chatRoom.participants.some(p => p.userId === auth.user.id)
    if (!isParticipant) {
      return NextResponse.json({ error: "채팅방에 참여하지 않았습니다" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      chatRoom
    })
  } catch (error) {
    console.error("Error fetching chat room:", error)
    return NextResponse.json({ error: "채팅방 정보를 불러오는데 실패했습니다" }, { status: 500 })
  }
})