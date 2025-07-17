
import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Post, User } from "@/lib/schemas"
import { verifyAuth } from "@/lib/auth-middleware"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const userId = params.id

    // 사용자의 게시글 조회
    const posts = await Post.find({ author: userId })
      .populate("author", "nickname avatar verified")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const totalPosts = await Post.countDocuments({ author: userId })
    const hasNextPage = totalPosts > page * limit

    // 게시글 데이터 변환
    const transformedPosts = posts.map(post => ({
      id: post._id.toString(),
      content: post.content,
      author: {
        id: post.author._id.toString(),
        nickname: post.author.nickname,
        avatar: post.author.avatar,
        verified: post.author.verified,
      },
      likes: post.likes?.length || 0,
      comments: post.comments?.length || 0,
      isLiked: false, // 현재 사용자의 좋아요 상태는 별도 처리 필요
      isBookmarked: false, // 현재 사용자의 북마크 상태는 별도 처리 필요
      createdAt: post.createdAt,
      images: post.images || [],
      tags: post.tags || [],
    }))

    return NextResponse.json({
      posts: transformedPosts,
      page,
      hasNextPage,
      totalPosts,
    })
  } catch (error) {
    console.error("Error fetching user posts:", error)
    return NextResponse.json(
      { error: "게시글 조회 실패" },
      { status: 500 }
    )
  }
}
