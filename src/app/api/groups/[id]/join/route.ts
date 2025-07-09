
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const POST = withAuth(async (request: NextRequest, auth: { user: any }, { params }: { params: { id: string } }) => {
  try {
    const groupId = params.id

    // 그룹 존재 확인
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    })

    if (!group) {
      return NextResponse.json({ error: "그룹을 찾을 수 없습니다" }, { status: 404 })
    }

    // 이미 가입했는지 확인
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: auth.user.id
        }
      }
    })

    if (existingMember) {
      return NextResponse.json({ error: "이미 가입한 그룹입니다" }, { status: 409 })
    }

    // 그룹 가입
    await prisma.groupMember.create({
      data: {
        groupId,
        userId: auth.user.id,
        role: "MEMBER"
      }
    })

    // 멤버 카운트 업데이트
    await prisma.group.update({
      where: { id: groupId },
      data: {
        membersCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "그룹에 가입했습니다"
    })
  } catch (error) {
    console.error("Error joining group:", error)
    return NextResponse.json({ error: "그룹 가입에 실패했습니다" }, { status: 500 })
  }
})

export const DELETE = withAuth(async (request: NextRequest, auth: { user: any }, { params }: { params: { id: string } }) => {
  try {
    const groupId = params.id

    // 멤버십 확인
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: auth.user.id
        }
      }
    })

    if (!membership) {
      return NextResponse.json({ error: "가입하지 않은 그룹입니다" }, { status: 404 })
    }

    // 소유자는 탈퇴할 수 없음
    if (membership.role === "OWNER") {
      return NextResponse.json({ error: "그룹 소유자는 탈퇴할 수 없습니다" }, { status: 400 })
    }

    // 그룹 탈퇴
    await prisma.groupMember.delete({
      where: {
        id: membership.id
      }
    })

    // 멤버 카운트 업데이트
    await prisma.group.update({
      where: { id: groupId },
      data: {
        membersCount: {
          decrement: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "그룹에서 탈퇴했습니다"
    })
  } catch (error) {
    console.error("Error leaving group:", error)
    return NextResponse.json({ error: "그룹 탈퇴에 실패했습니다" }, { status: 500 })
  }
})
