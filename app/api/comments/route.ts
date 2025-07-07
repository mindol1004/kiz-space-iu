import { type NextRequest, NextResponse } from "next/server"
import { createComment, getCommentsByPostId } from "@/lib/db-operations"
import { CommentSchema } from "@/lib/schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    const comments = await getCommentsByPostId(postId)

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error in GET /api/comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the comment data
    const validatedComment = CommentSchema.parse({
      ...body,
      authorId: body.authorId || "temp-user-id", // TODO: Get from auth session
    })

    const result = await createComment(validatedComment)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/comments:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
