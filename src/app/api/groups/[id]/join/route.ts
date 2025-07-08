import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if user is already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId: params.id,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json({ error: "User is already a member" }, { status: 409 })
    }

    // Add user to group
    await prisma.groupMember.create({
      data: {
        userId,
        groupId: params.id,
        role: "member",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error joining group:", error)
    return NextResponse.json({ error: "Failed to join group" }, { status: 500 })
  }
}
