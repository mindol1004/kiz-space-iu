
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const GET = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const children = await prisma.child.findMany({
      where: {
        parentId: auth.user.id,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      children,
    })
  } catch (error) {
    console.error("Error fetching children:", error)
    return NextResponse.json({ error: "Failed to fetch children" }, { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { name, age, gender, avatar, birthDate } = await request.json()

    if (!name || !age || !gender) {
      return NextResponse.json({ error: "Name, age, and gender are required" }, { status: 400 })
    }

    const child = await prisma.child.create({
      data: {
        parentId: auth.user.id,
        name,
        age,
        gender,
        avatar,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    })

    return NextResponse.json({
      success: true,
      child,
    })
  } catch (error) {
    console.error("Error creating child:", error)
    return NextResponse.json({ error: "Failed to create child" }, { status: 500 })
  }
})
