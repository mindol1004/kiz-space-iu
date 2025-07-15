
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { 
  generateAccessToken, 
  generateRefreshToken,
  verifyRefreshToken,
  generateTokenId,
  getTokenExpirationDate 
} from "@/lib/jwt"

export async function POST(request: NextRequest) {
  let clientRefreshToken: string | null = null;
  try {
    const contentLength = request.headers.get('content-length');
    // Only attempt to parse JSON if there is a body
    if (contentLength && parseInt(contentLength, 10) > 0) {
      const body = await request.json();
      clientRefreshToken = body.refreshToken;
    }
  } catch (error) {
    // If JSON parsing fails, log a warning and continue.
    console.warn("Could not parse request body as JSON, will check cookies for refresh token:", error);
  }
    
  try {
    // Try to get refresh token from cookie if not provided in body
    const refreshToken = clientRefreshToken || request.cookies.get('refreshToken')?.value

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token required" }, { status: 401 })
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
    }

    // Find token in database
    const tokenRecord = await prisma.token.findFirst({
      where: {
        refreshToken,
        isRevoked: false,
        isBlacklisted: false,
        refreshTokenExpiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    })

    if (!tokenRecord) {
      return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 })
    }

    // Generate new tokens
    const newTokenId = generateTokenId()
    const newJwtPayload = {
      userId: tokenRecord.userId,
      email: tokenRecord.user.email,
      tokenId: newTokenId
    }

    const newAccessToken = generateAccessToken(newJwtPayload)
    const newRefreshToken = generateRefreshToken(newJwtPayload)

    // Revoke old token and create new one
    await prisma.$transaction([
      prisma.token.update({
        where: { id: tokenRecord.id },
        data: { isRevoked: true }
      }),
      prisma.token.create({
        data: {
          id: newTokenId,
          userId: tokenRecord.userId,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          accessTokenExpiresAt: getTokenExpirationDate('15m'),
          refreshTokenExpiresAt: getTokenExpirationDate('7d'),
          deviceId: tokenRecord.deviceId,
          userAgent: tokenRecord.userAgent,
          ipAddress: tokenRecord.ipAddress,
          lastUsedAt: new Date()
        }
      })
    ])

    const response = NextResponse.json({
      success: true,
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 900 // 15 minutes in seconds
      }
    })

    // Update cookies
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 // 15 minutes
    })

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
