
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    let requestBody: { refreshToken?: string; logoutAll?: boolean } = {}
    
    // 요청 본문이 있는지 확인하고 안전하게 파싱
    try {
      const body = await request.text()
      if (body.trim()) {
        requestBody = JSON.parse(body)
      }
    } catch (parseError) {
      // JSON 파싱 실패 시 빈 객체 사용
      console.warn("Failed to parse request body, using empty object:", parseError)
    }
    
    const { refreshToken: clientRefreshToken, logoutAll = false } = requestBody
    
    // Get tokens from cookies or request body
    const accessToken = request.cookies.get('accessToken')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
    const refreshToken = clientRefreshToken || request.cookies.get('refreshToken')?.value

    if (!accessToken && !refreshToken) {
      return NextResponse.json({ error: "No tokens provided" }, { status: 400 })
    }

    let userId: string | null = null

    // Try to get user ID from access token
    if (accessToken) {
      const payload = verifyAccessToken(accessToken)
      if (payload) {
        userId = payload.userId
      }
    }

    // If we have refresh token, we can also get user from it
    if (refreshToken && !userId) {
      const tokenRecord = await prisma.token.findFirst({
        where: { refreshToken },
        select: { userId: true }
      })
      if (tokenRecord) {
        userId = tokenRecord.userId
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Invalid tokens" }, { status: 401 })
    }

    if (logoutAll) {
      // Revoke all user tokens
      await prisma.token.updateMany({
        where: { 
          userId,
          isRevoked: false 
        },
        data: { isRevoked: true }
      })
    } else {
      // Revoke specific tokens
      const tokensToRevoke = []
      
      if (accessToken) {
        tokensToRevoke.push({ accessToken })
      }
      
      if (refreshToken) {
        tokensToRevoke.push({ refreshToken })
      }

      if (tokensToRevoke.length > 0) {
        await prisma.token.updateMany({
          where: {
            OR: tokensToRevoke,
            isRevoked: false
          },
          data: { isRevoked: true }
        })
      }
    }

    const response = NextResponse.json({
      success: true,
      message: logoutAll ? "Logged out from all devices" : "Logged out successfully"
    })

    // Clear cookies
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
