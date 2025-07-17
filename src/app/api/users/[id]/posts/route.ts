
import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Post, User, Like, Comment } from "@/lib/schemas"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const userId = params.id
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // 사용자 존재 확인
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다" }, { status: 404 })
    }

    // 사용자의 게시글 조회
    const posts = await Post.find({ authorId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // 게시글에 대한 추가 정보 조회
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const [likesCount, commentsCount, author] = await Promise.all([
          Like.countDocuments({ targetId: post._id, targetType: 'post' }),
          Comment.countDocuments({ postId: post._id }),
          User.findById(post.authorId).select('nickname avatar')
        ])

        return {
          id: post._id.toString(),
          content: post.content,
          author: {
            id: author._id.toString(),
            nickname: author.nickname,
            avatar: author.avatar || null,
          },
          likes: likesCount,
          comments: commentsCount,
          isLiked: false, // 현재 사용자의 좋아요 상태는 별도로 처리 필요
          isBookmarked: post.bookmarks?.includes(userId) || false,
          createdAt: post.createdAt,
          images: post.images || [],
          tags: post.tags || [],
        }
      })
    )

    const totalPosts = await Post.countDocuments({ authorId: userId })
    const hasNextPage = skip + limit < totalPosts

    return NextResponse.json({
      posts: postsWithDetails,
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
