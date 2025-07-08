import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { roomId, userId } = await request.json()

    if (!roomId || !userId) {
      return NextResponse.json({ error: "Room ID and User ID are required" }, { status: 400 })
    }

    // 해당 채팅방의 모든 메시지를 읽음 처리
    // 실제로는 MessageRead 테이블을 사용하여 읽음 상태 관리
    const result = await prisma.message.updateMany({
      where: {
        OR: [
          { groupId: roomId },
          {
            AND: [
              { senderId: roomId, receiverId: userId },
              { senderId: userId, receiverId: roomId },
            ],
          },
        ],
        NOT: {
          senderId: userId, // 자신이 보낸 메시지는 제외
        },
      },
      data: {
        // 읽음 처리 로직 - 실제로는 별도 테이블로 관리
      },
    })

    return NextResponse.json({
      success: true,
      message: "Messages marked as read",
      updatedCount: result.count,
    })
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return NextResponse.json({ error: "Failed to mark messages as read" }, { status: 500 })
  }
}
