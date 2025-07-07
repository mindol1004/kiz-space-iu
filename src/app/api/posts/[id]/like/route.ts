import { type NextRequest, NextResponse } from "next/server"
import { likePost } from "@/lib/db-operations"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const result = await likePost(params.id, userId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/posts/[id]/like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
