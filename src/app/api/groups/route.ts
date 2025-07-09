
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const where: any = {}
    if (category && category !== "all") {
      where.category = category
    }
    if (location) {
      where.location = { contains: location, mode: "insensitive" }
    }

    const groups = await prisma.group.findMany({
      where,
      include: {
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: [
        { isVerified: "desc" },
        { membersCount: "desc" },
        { createdAt: "desc" }
      ],
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.group.count({ where })

    return NextResponse.json({
      groups: groups.map(group => ({
        ...group,
        membersCount: group._count.members
      })),
      hasMore: groups.length === limit,
      nextPage: groups.length === limit ? page + 1 : undefined,
      total
    })
  } catch (error) {
    console.error("Error fetching groups:", error)
    return NextResponse.json({ error: "그룹을 불러오는데 실패했습니다" }, { status: 500 })
  }
}

export const POST = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { name, description, category, location, avatar, banner, isPrivate } = await request.json()

    if (!name || !description || !category) {
      return NextResponse.json({ error: "이름, 설명, 카테고리는 필수입니다" }, { status: 400 })
    }

    const group = await prisma.group.create({
      data: {
        name,
        description,
        category,
        location: location || null,
        avatar: avatar || null,
        banner: banner || null,
        isPrivate: isPrivate || false
      }
    })

    // 생성자를 그룹 소유자로 추가
    await prisma.groupMember.create({
      data: {
        groupId: group.id,
        userId: auth.user.id,
        role: "OWNER"
      }
    })

    // 그룹 멤버 카운트 업데이트
    await prisma.group.update({
      where: { id: group.id },
      data: { membersCount: 1 }
    })

    return NextResponse.json({
      success: true,
      group
    })
  } catch (error) {
    console.error("Error creating group:", error)
    return NextResponse.json({ error: "그룹 생성에 실패했습니다" }, { status: 500 })
  }
})
