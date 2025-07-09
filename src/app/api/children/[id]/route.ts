
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const GET = withAuth(async (request: NextRequest, auth: { user: any }, { params }: { params: { id: string } }) => {
  try {
    const child = await prisma.child.findUnique({
      where: {
        id: params.id
      }
    })

    if (!child) {
      return NextResponse.json({ error: "자녀 정보를 찾을 수 없습니다" }, { status: 404 })
    }

    // 권한 확인
    if (child.parentId !== auth.user.id) {
      return NextResponse.json({ error: "접근 권한이 없습니다" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      child
    })
  } catch (error) {
    console.error("Error fetching child:", error)
    return NextResponse.json({ error: "자녀 정보를 불러오는데 실패했습니다" }, { status: 500 })
  }
})

export const PUT = withAuth(async (request: NextRequest, auth: { user: any }, { params }: { params: { id: string } }) => {
  try {
    const { name, age, gender, avatar, birthDate } = await request.json()

    const existingChild = await prisma.child.findUnique({
      where: {
        id: params.id
      }
    })

    if (!existingChild) {
      return NextResponse.json({ error: "자녀 정보를 찾을 수 없습니다" }, { status: 404 })
    }

    // 권한 확인
    if (existingChild.parentId !== auth.user.id) {
      return NextResponse.json({ error: "접근 권한이 없습니다" }, { status: 403 })
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (age !== undefined) updateData.age = Number(age)
    if (gender !== undefined) updateData.gender = gender.toUpperCase()
    if (avatar !== undefined) updateData.avatar = avatar
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null

    const child = await prisma.child.update({
      where: {
        id: params.id
      },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      child
    })
  } catch (error) {
    console.error("Error updating child:", error)
    return NextResponse.json({ error: "자녀 정보 수정에 실패했습니다" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (request: NextRequest, auth: { user: any }, { params }: { params: { id: string } }) => {
  try {
    const existingChild = await prisma.child.findUnique({
      where: {
        id: params.id
      }
    })

    if (!existingChild) {
      return NextResponse.json({ error: "자녀 정보를 찾을 수 없습니다" }, { status: 404 })
    }

    // 권한 확인
    if (existingChild.parentId !== auth.user.id) {
      return NextResponse.json({ error: "접근 권한이 없습니다" }, { status: 403 })
    }

    await prisma.child.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error("Error deleting child:", error)
    return NextResponse.json({ error: "자녀 정보 삭제에 실패했습니다" }, { status: 500 })
  }
})
