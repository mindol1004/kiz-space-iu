import { type NextRequest, NextResponse } from "next/server"
import { getPosts, createPost } from "@/lib/db-operations"
import { PostSchema } from "@/lib/schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const ageGroup = searchParams.get("ageGroup") || undefined
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const result = await getPosts({ category, ageGroup, page, limit })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in GET /api/posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the post data
    const validatedPost = PostSchema.parse({
      ...body,
      authorId: body.authorId || "temp-user-id", // TODO: Get from auth session
    })

    const result = await createPost(validatedPost)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in POST /api/posts:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
