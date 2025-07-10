
import { NextRequest, NextResponse } from "next/server"
import { getUserFromCookies } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookies(request)
    
    if (!user) {
      return NextResponse.json({ error: "인증되지 않은 사용자입니다" }, { status: 401 })
    }

    return NextResponse.json({ 
      user,
      authenticated: true 
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "인증 확인 중 오류가 발생했습니다" }, { status: 500 })
  }
}
