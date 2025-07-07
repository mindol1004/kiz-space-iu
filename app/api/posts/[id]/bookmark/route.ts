import { type NextRequest, NextResponse } from "next/server"
import { bookmarkPost } from "@/lib/db-operations"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const result = await bookmarkPost(params.id, userId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/posts/[id]/bookmark:", error)
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 })
  }
}
