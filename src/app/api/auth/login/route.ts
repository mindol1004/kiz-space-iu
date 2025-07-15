import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { 
  generateAccessToken, 
  generateRefreshToken, 
  generateTokenId,
  getTokenExpirationDate 
} from "@/lib/jwt"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, deviceId } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate token ID
    const tokenId = generateTokenId()

    // Create JWT payload
    const jwtPayload = {
      userId: user.id,
      email: user.email,
      tokenId
    }

    // Generate tokens
    const accessToken = generateAccessToken(jwtPayload)
    const refreshToken = generateRefreshToken(jwtPayload)

    // Get client info
    const userAgent = request.headers.get('user-agent') || ''
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIP || ''

    // Save tokens to database
    await prisma.token.create({
      data: {
        id: tokenId,
        userId: user.id,
        accessToken,
        refreshToken,
        accessTokenExpiresAt: getTokenExpirationDate('15m'),
        refreshTokenExpiresAt: getTokenExpirationDate('7d'),
        deviceId: deviceId || null,
        userAgent,
        ipAddress,
        lastUsedAt: new Date()
      }
    })

    // Update user last seen
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSeenAt: new Date() }
    })

    // Return user data and tokens (excluding password)
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 900 // 15 minutes in seconds
      }
    })

    // 쿠키 설정
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    }

    response.cookies.set('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, // 15분
    })

    response.cookies.set('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, // 7일
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}