import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const where: any = {}
    if (category && category !== "all") {
      where.category = category
    }

    const groups = await prisma.group.findMany({
      where,
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      groups: groups.map((group) => ({
        ...group,
        memberCount: group._count.members,
      })),
      hasMore: groups.length === limit,
    })
  } catch (error) {
    console.error("Error fetching groups:", error)
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, category, isPrivate, creatorId } = await request.json()

    if (!name || !creatorId) {
      return NextResponse.json({ error: "Name and creator ID are required" }, { status: 400 })
    }

    const group = await prisma.group.create({
      data: {
        name,
        description: description || "",
        category: category || "general",
        isPrivate: isPrivate || false,
        creatorId,
      },
    })

    // Add creator as first member
    await prisma.groupMember.create({
      data: {
        userId: creatorId,
        groupId: group.id,
        role: "admin",
      },
    })

    return NextResponse.json({ success: true, group })
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 })
  }
}
