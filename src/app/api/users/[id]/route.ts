import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/schemas"
import { verifyAuth } from "@/lib/auth-middleware"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const userId = params.id
    const user = await User.findById(userId).select('-password')

    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다" }, { status: 404 })
    }

    return NextResponse.json({
      id: user._id.toString(),
      nickname: user.nickname,
      email: user.email,
      bio: user.bio || "",
      location: user.location || "",
      createdAt: user.createdAt,
      verified: user.verified || false,
      interests: user.interests || [],
      avatar: user.avatar,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "프로필 조회 실패" },
      { status: 500 }
    )
  }
}

export async function PUT(
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
    const data = await request.json()

    // 사용자 본인만 프로필 수정 가능
    if (authResult.user.id !== userId) {
      return NextResponse.json({ error: "권한이 없습니다" }, { status: 403 })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          nickname: data.nickname,
          bio: data.bio,
          location: data.location,
          interests: data.interests,
        }
      },
      { new: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다" }, { status: 404 })
    }

    return NextResponse.json({
      id: updatedUser._id.toString(),
      nickname: updatedUser.nickname,
      email: updatedUser.email,
      bio: updatedUser.bio || "",
      location: updatedUser.location || "",
      createdAt: updatedUser.createdAt,
      verified: updatedUser.verified || false,
      interests: updatedUser.interests || [],
      avatar: updatedUser.avatar,
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { error: "프로필 업데이트 실패" },
      { status: 500 }
    )
  }
}