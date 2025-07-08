import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get("groupId")
    const receiverId = searchParams.get("receiverId")
    const senderId = searchParams.get("senderId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const where: any = {}

    if (groupId) {
      where.groupId = groupId
    } else if (receiverId && senderId) {
      where.OR = [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ]
    } else {
      return NextResponse.json({ error: "Group ID or both sender and receiver IDs are required" }, { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      messages: messages.reverse(),
      hasMore: messages.length === limit,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, senderId, receiverId, groupId, type } = await request.json()

    if (!content || !senderId) {
      return NextResponse.json({ error: "Content and sender ID are required" }, { status: 400 })
    }

    if (!receiverId && !groupId) {
      return NextResponse.json({ error: "Either receiver ID or group ID is required" }, { status: 400 })
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        groupId,
        type: type || "text",
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
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
