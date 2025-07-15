import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const weeklyEvents = await prisma.event.findMany({
      where: {
        startDate: {
          gte: new Date() // 현재 시간 이후의 이벤트
        }
      },
      orderBy: {
        startDate: "asc"
      },
      take: 5 // 주간 이벤트 5개
    })

    return NextResponse.json({
      events: weeklyEvents
    })
  } catch (error) {
    console.error("Error fetching weekly events:", error)
    return NextResponse.json({ error: "주간 이벤트를 불러오는데 실패했습니다" }, { status: 500 })
  }
}
