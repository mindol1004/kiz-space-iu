import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "kiz-space"

async function initializeDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log("🔌 MongoDB에 연결 중...")
    await client.connect()
    console.log("✅ MongoDB 연결 성공!")

    const db = client.db(DB_NAME)

    // 컬렉션 생성 및 인덱스 설정
    console.log("📊 컬렉션 및 인덱스 생성 중...")

    // Users 컬렉션
    const usersCollection = db.collection("users")
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    await usersCollection.createIndex({ nickname: 1 })
    console.log("👤 Users 컬렉션 및 인덱스 생성 완료")

    // Posts 컬렉션
    const postsCollection = db.collection("posts")
    await postsCollection.createIndex({ createdAt: -1 })
    await postsCollection.createIndex({ category: 1, ageGroup: 1 })
    await postsCollection.createIndex({ authorId: 1 })
    await postsCollection.createIndex({ tags: 1 })
    console.log("📝 Posts 컬렉션 및 인덱스 생성 완료")

    // Comments 컬렉션
    const commentsCollection = db.collection("comments")
    await commentsCollection.createIndex({ postId: 1 })
    await commentsCollection.createIndex({ authorId: 1 })
    await commentsCollection.createIndex({ createdAt: -1 })
    console.log("💬 Comments 컬렉션 및 인덱스 생성 완료")

    // Children 컬렉션
    const childrenCollection = db.collection("children")
    await childrenCollection.createIndex({ parentId: 1 })
    console.log("👶 Children 컬렉션 및 인덱스 생성 완료")

    // Groups 컬렉션
    const groupsCollection = db.collection("groups")
    await groupsCollection.createIndex({ category: 1 })
    await groupsCollection.createIndex({ members: 1 })
    console.log("👥 Groups 컬렉션 및 인덱스 생성 완료")

    // Messages 컬렉션
    const messagesCollection = db.collection("messages")
    await messagesCollection.createIndex({ senderId: 1, receiverId: 1 })
    await messagesCollection.createIndex({ groupId: 1 })
    await messagesCollection.createIndex({ createdAt: -1 })
    console.log("💌 Messages 컬렉션 및 인덱스 생성 완료")

    console.log("🎉 데이터베이스 초기화 완료!")
  } catch (error) {
    console.error("❌ 데이터베이스 초기화 실패:", error)
    throw error
  } finally {
    await client.close()
    console.log("🔌 MongoDB 연결 종료")
  }
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log("✅ 초기화 스크립트 실행 완료")
      process.exit(0)
    })
    .catch((error) => {
      console.error("❌ 초기화 스크립트 실행 실패:", error)
      process.exit(1)
    })
}

export { initializeDatabase }
