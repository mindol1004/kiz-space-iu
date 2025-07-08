import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    const results: any = {}

    if (type === "all" || type === "posts") {
      const posts = await prisma.post.findMany({
        where: {
          OR: [{ content: { contains: query, mode: "insensitive" } }, { tags: { has: query } }],
        },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likes: true,
              bookmarks: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      })

      results.posts = posts.map((post) => ({
        ...post,
        commentCount: post._count.comments,
        likesCount: post._count.likes,
        bookmarksCount: post._count.bookmarks,
      }))
    }

    if (type === "all" || type === "users") {
      const users = await prisma.user.findMany({
        where: {
          nickname: { contains: query, mode: "insensitive" },
        },
        select: {
          id: true,
          nickname: true,
          avatar: true,
          location: true,
          verified: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      })

      results.users = users
    }

    if (type === "all" || type === "groups") {
      const groups = await prisma.group.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          _count: {
            select: {
              members: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      })

      results.groups = groups.map((group) => ({
        ...group,
        memberCount: group._count.members,
      }))
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
