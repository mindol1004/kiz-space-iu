import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    // 개발 환경에서만 실행 허용
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Init endpoint only available in development" }, { status: 403 })
    }

    console.log("🔧 데이터베이스 초기화 시작...")
    const db = await getDatabase()

    // 컬렉션 생성 및 인덱스 설정
    console.log("📊 컬렉션 및 인덱스 생성 중...")

    // Users 컬렉션
    const usersCollection = db.collection("users")
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    await usersCollection.createIndex({ nickname: 1 })

    // Posts 컬렉션
    const postsCollection = db.collection("posts")
    await postsCollection.createIndex({ createdAt: -1 })
    await postsCollection.createIndex({ category: 1, ageGroup: 1 })
    await postsCollection.createIndex({ authorId: 1 })
    await postsCollection.createIndex({ tags: 1 })

    // Comments 컬렉션
    const commentsCollection = db.collection("comments")
    await commentsCollection.createIndex({ postId: 1 })
    await commentsCollection.createIndex({ authorId: 1 })
    await commentsCollection.createIndex({ createdAt: -1 })

    // Children 컬렉션
    const childrenCollection = db.collection("children")
    await childrenCollection.createIndex({ parentId: 1 })

    // Groups 컬렉션
    const groupsCollection = db.collection("groups")
    await groupsCollection.createIndex({ category: 1 })
    await groupsCollection.createIndex({ members: 1 })

    // Messages 컬렉션
    const messagesCollection = db.collection("messages")
    await messagesCollection.createIndex({ senderId: 1, receiverId: 1 })
    await messagesCollection.createIndex({ groupId: 1 })
    await messagesCollection.createIndex({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      message: "데이터베이스 초기화 완료",
      collections: ["users", "posts", "comments", "children", "groups", "messages"],
    })
  } catch (error) {
    console.error("데이터베이스 초기화 실패:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
