import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST() {
  try {
    // 개발 환경에서만 실행 허용
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Seed endpoint only available in development" }, { status: 403 })
    }

    console.log("🌱 시드 데이터 생성 시작...")
    const db = await getDatabase()

    // 기존 데이터 삭제
    await Promise.all([
      db.collection("users").deleteMany({}),
      db.collection("posts").deleteMany({}),
      db.collection("comments").deleteMany({}),
      db.collection("children").deleteMany({}),
    ])

    // 샘플 사용자 생성
    const users = [
      {
        _id: new ObjectId(),
        email: "minji.mom@example.com",
        nickname: "민지맘",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "서울 강남구",
        interests: ["신생아케어", "유아놀이", "홈스쿨링"],
        verified: true,
        createdAt: new Date("2023-03-15"),
        updatedAt: new Date("2023-03-15"),
      },
      {
        _id: new ObjectId(),
        email: "seojun.mom@example.com",
        nickname: "서준이엄마",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "서울 서초구",
        interests: ["편식해결", "유아식", "놀이활동"],
        verified: true,
        createdAt: new Date("2023-04-20"),
        updatedAt: new Date("2023-04-20"),
      },
      {
        _id: new ObjectId(),
        email: "yejun.mom@example.com",
        nickname: "예준맘",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "서울 송파구",
        interests: ["초등교육", "한글교육", "수학교육"],
        verified: true,
        createdAt: new Date("2023-05-10"),
        updatedAt: new Date("2023-05-10"),
      },
      {
        _id: new ObjectId(),
        email: "working.mom@example.com",
        nickname: "워킹맘수진",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "서울 마포구",
        interests: ["워킹맘", "시간관리", "육아용품"],
        verified: false,
        createdAt: new Date("2023-06-01"),
        updatedAt: new Date("2023-06-01"),
      },
    ]

    await db.collection("users").insertMany(users)

    // 샘플 자녀 정보 생성
    const children = [
      {
        _id: new ObjectId(),
        parentId: users[0]._id.toString(),
        name: "민지",
        age: 2,
        gender: "female",
        createdAt: new Date("2023-03-15"),
      },
      {
        _id: new ObjectId(),
        parentId: users[1]._id.toString(),
        name: "서준",
        age: 4,
        gender: "male",
        createdAt: new Date("2023-04-20"),
      },
      {
        _id: new ObjectId(),
        parentId: users[1]._id.toString(),
        name: "서윤",
        age: 2,
        gender: "female",
        createdAt: new Date("2023-04-20"),
      },
      {
        _id: new ObjectId(),
        parentId: users[2]._id.toString(),
        name: "예준",
        age: 7,
        gender: "male",
        createdAt: new Date("2023-05-10"),
      },
    ]

    await db.collection("children").insertMany(children)

    // 샘플 게시글 생성
    const posts = [
      {
        _id: new ObjectId(),
        authorId: users[0]._id.toString(),
        content:
          "오늘 아이와 함께 만든 색깔 놀이예요! 물감 대신 식용 색소를 사용해서 안전하게 놀 수 있어요. 2세 아이도 정말 좋아하네요 ✨",
        images: ["/placeholder.svg?height=200&width=200"],
        category: "play",
        ageGroup: "0-2",
        tags: ["색깔놀이", "안전놀이", "집콕놀이"],
        likes: [users[1]._id.toString(), users[2]._id.toString()],
        bookmarks: [users[1]._id.toString()],
        commentCount: 2,
        createdAt: new Date("2024-01-15T10:30:00"),
        updatedAt: new Date("2024-01-15T10:30:00"),
      },
      {
        _id: new ObjectId(),
        authorId: users[1]._id.toString(),
        content:
          "아이가 편식이 심해서 고민이었는데, 이렇게 예쁘게 플레이팅하니까 잘 먹네요! 브로콜리도 나무라고 하면서 먹어요 😊",
        images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
        category: "food",
        ageGroup: "3-5",
        tags: ["편식", "플레이팅", "유아식"],
        likes: [users[0]._id.toString(), users[2]._id.toString(), users[3]._id.toString()],
        bookmarks: [users[0]._id.toString(), users[2]._id.toString()],
        commentCount: 1,
        createdAt: new Date("2024-01-15T09:15:00"),
        updatedAt: new Date("2024-01-15T09:15:00"),
      },
      {
        _id: new ObjectId(),
        authorId: users[2]._id.toString(),
        content:
          "초등학교 입학 준비 어떻게 하고 계신가요? 한글은 어느 정도까지 가르쳐야 할지 궁금해요. 경험담 공유해주세요!",
        images: [],
        category: "education",
        ageGroup: "6-8",
        tags: ["초등입학", "한글교육", "입학준비"],
        likes: [users[0]._id.toString(), users[1]._id.toString()],
        bookmarks: [users[0]._id.toString()],
        commentCount: 1,
        createdAt: new Date("2024-01-15T08:45:00"),
        updatedAt: new Date("2024-01-15T08:45:00"),
      },
      {
        _id: new ObjectId(),
        authorId: users[3]._id.toString(),
        content:
          "워킹맘들 어떻게 시간 관리하시나요? 아침에 아이 준비시키고 출근하는게 너무 힘들어요 😭 꿀팁 있으면 공유해주세요!",
        images: [],
        category: "advice",
        ageGroup: "all",
        tags: ["워킹맘", "시간관리", "육아고민"],
        likes: [users[0]._id.toString(), users[1]._id.toString(), users[2]._id.toString()],
        bookmarks: [users[1]._id.toString(), users[2]._id.toString()],
        commentCount: 0,
        createdAt: new Date("2024-01-14T20:30:00"),
        updatedAt: new Date("2024-01-14T20:30:00"),
      },
      {
        _id: new ObjectId(),
        authorId: users[0]._id.toString(),
        content:
          "아이 감기 걸렸을 때 집에서 할 수 있는 관리법 공유해요. 가습기 틀어주고 따뜻한 물 많이 먹이는게 도움이 되더라구요.",
        images: [],
        category: "health",
        ageGroup: "0-2",
        tags: ["감기관리", "건강관리", "홈케어"],
        likes: [users[1]._id.toString(), users[3]._id.toString()],
        bookmarks: [users[1]._id.toString(), users[2]._id.toString(), users[3]._id.toString()],
        commentCount: 0,
        createdAt: new Date("2024-01-14T15:20:00"),
        updatedAt: new Date("2024-01-14T15:20:00"),
      },
    ]

    await db.collection("posts").insertMany(posts)

    // 샘플 댓글 생성
    const comments = [
      {
        _id: new ObjectId(),
        postId: posts[0]._id.toString(),
        authorId: users[1]._id.toString(),
        content: "우와 정말 좋은 아이디어네요! 저도 해봐야겠어요",
        likes: [users[0]._id.toString()],
        createdAt: new Date("2024-01-15T11:00:00"),
      },
      {
        _id: new ObjectId(),
        postId: posts[0]._id.toString(),
        authorId: users[2]._id.toString(),
        content: "식용 색소는 어디서 구매하셨나요?",
        likes: [],
        createdAt: new Date("2024-01-15T11:15:00"),
      },
      {
        _id: new ObjectId(),
        postId: posts[1]._id.toString(),
        authorId: users[0]._id.toString(),
        content: "플레이팅 너무 예뻐요! 저희 아이도 편식이 심한데 따라해볼게요",
        likes: [users[1]._id.toString()],
        createdAt: new Date("2024-01-15T09:30:00"),
      },
      {
        _id: new ObjectId(),
        postId: posts[2]._id.toString(),
        authorId: users[1]._id.toString(),
        content: "저는 한글 읽기 정도만 가르쳤어요. 학교에서 체계적으로 가르쳐주더라구요",
        likes: [users[2]._id.toString()],
        createdAt: new Date("2024-01-15T09:00:00"),
      },
    ]

    await db.collection("comments").insertMany(comments)

    return NextResponse.json({
      success: true,
      message: "시드 데이터 생성 완료",
      data: {
        users: users.length,
        children: children.length,
        posts: posts.length,
        comments: comments.length,
      },
    })
  } catch (error) {
    console.error("시드 데이터 생성 실패:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}
