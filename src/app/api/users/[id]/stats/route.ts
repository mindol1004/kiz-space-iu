
import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Post } from "@/lib/schemas"
import { verifyAuth } from "@/lib/auth-middleware"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const userId = params.id

    // 게시글 수
    const postsCount = await Post.countDocuments({ author: userId })

    // 받은 좋아요 수 (모든 게시글의 좋아요 합계)
    const likesResult = await Post.aggregate([
      { $match: { author: userId } },
      { $group: { _id: null, totalLikes: { $sum: { $size: "$likes" } } } }
    ])
    const likesCount = likesResult[0]?.totalLikes || 0

    // 댓글 수 (모든 게시글의 댓글 합계)
    const commentsResult = await Post.aggregate([
      { $match: { author: userId } },
      { $group: { _id: null, totalComments: { $sum: { $size: "$comments" } } } }
    ])
    const commentsCount = commentsResult[0]?.totalComments || 0

    // 북마크 수 (다른 사용자들이 이 사용자의 게시글을 북마크한 수)
    const bookmarksResult = await Post.aggregate([
      { $match: { author: userId } },
      { $group: { _id: null, totalBookmarks: { $sum: { $size: "$bookmarks" } } } }
    ])
    const bookmarksCount = bookmarksResult[0]?.totalBookmarks || 0

    const stats = [
      { label: "게시글", value: postsCount, icon: "Edit" },
      { label: "좋아요", value: likesCount, icon: "Heart" },
      { label: "댓글", value: commentsCount, icon: "MessageCircle" },
      { label: "북마크", value: bookmarksCount, icon: "Bookmark" },
    ]

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json(
      { error: "통계 조회 실패" },
      { status: 500 }
    )
  }
}
