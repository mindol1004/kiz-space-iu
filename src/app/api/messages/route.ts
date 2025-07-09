
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const GET = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)
    const chatRoomId = searchParams.get("chatRoomId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    if (!chatRoomId) {
      return NextResponse.json({ error: "채팅방 ID가 필요합니다" }, { status: 400 })
    }

    // 채팅방 참여자인지 확인
    const participation = await prisma.chatParticipant.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId: auth.user.id
        }
      }
    })

    if (!participation) {
      return NextResponse.json({ error: "채팅방에 참여하지 않았습니다" }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: {
        chatRoomId
      },
      include: {
        sender: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                nickname: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })

    // 읽음 상태 업데이트
    await prisma.chatParticipant.update({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId: auth.user.id
        }
      },
      data: {
        lastReadAt: new Date(),
        unreadCount: 0
      }
    })

    return NextResponse.json({
      messages: messages.reverse(), // 시간순 정렬
      hasMore: messages.length === limit,
      nextPage: messages.length === limit ? page + 1 : undefined
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "메시지를 불러오는데 실패했습니다" }, { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { chatRoomId, content, type, attachments, replyToId } = await request.json()

    if (!chatRoomId || !content) {
      return NextResponse.json({ error: "채팅방 ID와 내용이 필요합니다" }, { status: 400 })
    }

    // 채팅방 참여자인지 확인
    const participation = await prisma.chatParticipant.findUnique({
      where: {
        chatRoomId_userId: {
          chatRoomId,
          userId: auth.user.id
        }
      }
    })

    if (!participation) {
      return NextResponse.json({ error: "채팅방에 참여하지 않았습니다" }, { status: 403 })
    }

    const message = await prisma.message.create({
      data: {
        chatRoomId,
        senderId: auth.user.id,
        content,
        type: type || "TEXT",
        attachments: attachments || [],
        replyToId: replyToId || null
      },
      include: {
        sender: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                nickname: true
              }
            }
          }
        }
      }
    })

    // 채팅방 정보 업데이트
    await prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: {
        lastMessageId: message.id,
        lastMessageContent: content,
        lastMessageAt: new Date()
      }
    })

    // 다른 참여자들의 미읽음 카운트 증가
    await prisma.chatParticipant.updateMany({
      where: {
        chatRoomId,
        userId: {
          not: auth.user.id
        }
      },
      data: {
        unreadCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      message
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "메시지 전송에 실패했습니다" }, { status: 500 })
  }
})
