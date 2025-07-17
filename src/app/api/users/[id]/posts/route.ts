
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const posts = await prisma.post.findMany({
      where: { 
        authorId: userId,
        isPublished: true 
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            verified: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    const totalPosts = await prisma.post.count({
      where: { 
        authorId: userId,
        isPublished: true 
      },
    })

    const formattedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      images: post.images,
      category: post.category,
      ageGroup: post.ageGroup,
      tags: post.tags,
      author: post.author,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      bookmarksCount: post._count.bookmarks,
      viewsCount: post.viewsCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }))

    return NextResponse.json({
      posts: formattedPosts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Error fetching user posts:", error)
    return NextResponse.json(
      { error: "게시글 조회 실패" },
      { status: 500 }
    )
  }
}
