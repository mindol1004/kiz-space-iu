
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const GET = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get("parentId") || auth.user.id

    const children = await prisma.child.findMany({
      where: {
        parentId
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      children
    })
  } catch (error) {
    console.error("Error fetching children:", error)
    return NextResponse.json({ error: "자녀 정보를 불러오는데 실패했습니다" }, { status: 500 })
  }
})

export const POST = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { name, age, gender, avatar, birthDate } = await request.json()

    if (!name || !age || !gender) {
      return NextResponse.json({ error: "이름, 나이, 성별은 필수입니다" }, { status: 400 })
    }

    const child = await prisma.child.create({
      data: {
        parentId: auth.user.id,
        name,
        age: Number(age),
        gender: gender.toUpperCase(),
        avatar: avatar || null,
        birthDate: birthDate ? new Date(birthDate) : null
      }
    })

    return NextResponse.json({
      success: true,
      child
    })
  } catch (error) {
    console.error("Error creating child:", error)
    return NextResponse.json({ error: "자녀 정보 추가에 실패했습니다" }, { status: 500 })
  }
})
