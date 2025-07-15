import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const trendingTags = await prisma.tag.findMany({
      orderBy: {
        usageCount: "desc"
      },
      take: 10 // 인기 태그 10개
    })

    return NextResponse.json({
      tags: trendingTags
    })
  } catch (error) {
    console.error("Error fetching trending tags:", error)
    return NextResponse.json({ error: "인기 태그를 불러오는데 실패했습니다" }, { status: 500 })
  }
}
