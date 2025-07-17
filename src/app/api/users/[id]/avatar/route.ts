
import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/schemas"
import { verifyAuth } from "@/lib/auth-middleware"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 })
    }

    await connectDB()
    
    const userId = params.id
    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json({ error: "파일이 필요합니다" }, { status: 400 })
    }

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다" }, { status: 400 })
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "이미지 파일만 업로드 가능합니다" }, { status: 400 })
    }

    // 실제 구현에서는 파일을 클라우드 스토리지에 업로드하고 URL을 받아야 합니다.
    // 여기서는 임시로 placeholder URL을 사용합니다.
    const avatarUrl = `/uploads/avatars/${userId}-${Date.now()}.jpg`

    // 사용자 아바타 URL 업데이트
    await User.findByIdAndUpdate(userId, { avatar: avatarUrl })

    return NextResponse.json({ avatarUrl })
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return NextResponse.json(
      { error: "아바타 업로드 실패" },
      { status: 500 }
    )
  }
}
