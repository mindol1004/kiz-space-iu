
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const parentId = getUserIdFromCookies(request)
    if (!parentId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const children = await prisma.child.findMany({
      where: { parentId: parentId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ children })
  } catch (error) {
    console.error("Error fetching children:", error)
    return NextResponse.json({ error: "아이 정보를 불러오는데 실패했습니다" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const parentId = getUserIdFromCookies(request)
    if (!parentId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const { name, age, gender, avatar, birthDate } = await request.json()

    if (!name || !age || !gender) {
      return NextResponse.json(
        { error: "이름, 나이, 성별은 필수입니다" },
        { status: 400 }
      )
    }

    const child = await prisma.child.create({
      data: {
        parentId: parentId,
        name,
        age,
        gender,
        avatar: avatar || null,
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    })

    return NextResponse.json({ child })
  } catch (error) {
    console.error("Error creating child:", error)
    return NextResponse.json({ error: "아이 정보 추가에 실패했습니다" }, { status: 500 })
  }
}
