import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const childId = params.id

    if (!childId) {
      return NextResponse.json({ error: "아이 ID가 필요합니다" }, { status: 400 })
    }

    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        parent: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    })

    if (!child) {
      return NextResponse.json({ error: "아이 정보를 찾을 수 없습니다" }, { status: 404 })
    }

    return NextResponse.json({ child })
  } catch (error) {
    console.error("Error fetching child:", error)
    return NextResponse.json({ error: "아이 정보를 불러오는데 실패했습니다" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const childId = params.id
    const parentId = getUserIdFromCookies(request)
    const { name, age, gender, avatar, birthDate } = await request.json()

    if (!parentId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    if (!childId) {
      return NextResponse.json({ error: "아이 ID가 필요합니다" }, { status: 400 })
    }

    // Verify ownership
    const existingChild = await prisma.child.findUnique({
      where: { id: childId },
    })

    if (!existingChild) {
      return NextResponse.json({ error: "아이 정보를 찾을 수 없습니다" }, { status: 404 })
    }

    if (existingChild.parentId !== parentId) {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 })
    }

    const updatedChild = await prisma.child.update({
      where: { id: childId },
      data: {
        name: name || existingChild.name,
        age: age !== undefined ? age : existingChild.age,
        gender: gender || existingChild.gender,
        avatar: avatar !== undefined ? avatar : existingChild.avatar,
        birthDate: birthDate ? new Date(birthDate) : existingChild.birthDate,
      },
    })

    return NextResponse.json({ child: updatedChild })
  } catch (error) {
    console.error("Error updating child:", error)
    return NextResponse.json({ error: "아이 정보 수정에 실패했습니다" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const childId = params.id
    const parentId = getUserIdFromCookies(request)

    if (!parentId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    if (!childId) {
      return NextResponse.json({ error: "아이 ID가 필요합니다" }, { status: 400 })
    }

    // Verify ownership
    const existingChild = await prisma.child.findUnique({
      where: { id: childId },
    })

    if (!existingChild) {
      return NextResponse.json({ error: "아이 정보를 찾을 수 없습니다" }, { status: 404 })
    }

    if (existingChild.parentId !== parentId) {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 })
    }

    await prisma.child.delete({
      where: { id: childId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting child:", error)
    return NextResponse.json({ error: "아이 정보 삭제에 실패했습니다" }, { status: 500 })
  }
}