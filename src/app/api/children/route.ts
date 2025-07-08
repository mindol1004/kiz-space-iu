import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId")

    if (!parentId) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 })
    }

    const children = await prisma.child.findMany({
      where: { parentId },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ children })
  } catch (error) {
    console.error("Error fetching children:", error)
    return NextResponse.json({ error: "Failed to fetch children" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, age, gender, parentId } = await request.json()

    if (!name || !age || !gender || !parentId) {
      return NextResponse.json({ error: "Name, age, gender, and parent ID are required" }, { status: 400 })
    }

    const child = await prisma.child.create({
      data: {
        name,
        age,
        gender,
        parentId,
      },
    })

    return NextResponse.json({ success: true, child })
  } catch (error) {
    console.error("Error creating child:", error)
    return NextResponse.json({ error: "Failed to create child" }, { status: 500 })
  }
}
