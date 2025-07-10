
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromCookies(request)
    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const chatRoomId = searchParams.get("chatRoomId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    if (!chatRoomId) {
      return NextResponse.json({ error: "채팅방 ID가 필요합니다" }, { status: 400 })
    }

    // Check if user is participant of the chat room
    const participant = await prisma.chatParticipant.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId: chatRoomId,
          userId: userId,
        },
      },
    })

    if (!participant) {
      return NextResponse.json({ error: "채팅방에 참여하지 않은 사용자입니다" }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: {
        chatRoomId: chatRoomId,
        isDeleted: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.message.count({
      where: {
        chatRoomId: chatRoomId,
        isDeleted: false,
      },
    })

    return NextResponse.json({
      messages: messages.reverse(), // 최신 메시지가 아래로 오도록
      hasMore: total > page * limit,
      nextPage: total > page * limit ? page + 1 : undefined,
      total,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "메시지를 불러오는데 실패했습니다" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const senderId = getUserIdFromCookies(request)
    if (!senderId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const { chatRoomId, content, type, attachments, replyToId } = await request.json()

    if (!chatRoomId || !content) {
      return NextResponse.json({ error: "채팅방 ID와 메시지 내용이 필요합니다" }, { status: 400 })
    }

    // Check if user is participant of the chat room
    const participant = await prisma.chatParticipant.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId: chatRoomId,
          userId: senderId,
        },
      },
    })

    if (!participant) {
      return NextResponse.json({ error: "채팅방에 참여하지 않은 사용자입니다" }, { status: 403 })
    }

    const message = await prisma.message.create({
      data: {
        chatRoomId: chatRoomId,
        senderId: senderId,
        content: content,
        type: type || "TEXT",
        attachments: attachments || [],
        replyToId: replyToId || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    // Update chat room's last message info
    await prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        lastMessageId: message.id,
        lastMessageContent: content,
        lastMessageAt: new Date(),
      },
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "메시지 전송에 실패했습니다" }, { status: 500 })
  }
}
