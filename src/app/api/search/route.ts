
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"

export const GET = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "all"
    const category = searchParams.get("category")
    const dateRange = searchParams.get("dateRange") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!query) {
      return NextResponse.json({ error: "검색어가 필요합니다" }, { status: 400 })
    }

    const results: any = {
      posts: [],
      users: [],
      groups: [],
      total: 0
    }

    // 날짜 필터링
    let dateFilter: any = {}
    if (dateRange !== "all") {
      const now = new Date()
      switch (dateRange) {
        case "day":
          dateFilter = {
            createdAt: {
              gte: new Date(now.setDate(now.getDate() - 1))
            }
          }
          break
        case "week":
          dateFilter = {
            createdAt: {
              gte: new Date(now.setDate(now.getDate() - 7))
            }
          }
          break
        case "month":
          dateFilter = {
            createdAt: {
              gte: new Date(now.setMonth(now.getMonth() - 1))
            }
          }
          break
      }
    }

    // 포스트 검색
    if (type === "all" || type === "posts") {
      const postWhere: any = {
        OR: [
          { content: { contains: query, mode: "insensitive" } },
          { tags: { has: query } }
        ],
        ...dateFilter
      }

      if (category && category !== "all") {
        postWhere.category = category
      }

      const posts = await prisma.post.findMany({
        where: postWhere,
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
              avatar: true
            }
          },
          _count: {
            select: {
              comments: true,
              likes: true,
              bookmarks: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      })

      results.posts = posts.map(post => ({
        ...post,
        commentCount: post._count.comments,
        likesCount: post._count.likes,
        bookmarksCount: post._count.bookmarks
      }))
    }

    // 사용자 검색
    if (type === "all" || type === "users") {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { nickname: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { interests: { has: query } }
          ],
          ...dateFilter
        },
        select: {
          id: true,
          nickname: true,
          avatar: true,
          location: true,
          interests: true,
          verified: true,
          postsCount: true,
          followersCount: true,
          followingCount: true
        },
        skip: (page - 1) * limit,
        take: limit
      })

      results.users = users
    }

    // 그룹 검색 (스키마에 정의되어 있지만 실제 데이터가 없으므로 빈 배열 반환)
    if (type === "all" || type === "groups") {
      results.groups = []
    }

    results.total = results.posts.length + results.users.length + results.groups.length

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error searching:", error)
    return NextResponse.json({ error: "검색에 실패했습니다" }, { status: 500 })
  }
})
