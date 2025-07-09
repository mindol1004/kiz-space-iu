
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/jwt"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    nickname: string
    avatar?: string
    verified: boolean
  }
}

export async function authenticateToken(request: NextRequest): Promise<{
  isAuthenticated: boolean
  user?: any
  error?: string
}> {
  try {
    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization')
    const cookieToken = request.cookies.get('accessToken')?.value
    
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7)
      : cookieToken

    if (!token) {
      return { isAuthenticated: false, error: "No token provided" }
    }

    // Verify JWT token
    const payload = verifyAccessToken(token)
    if (!payload) {
      return { isAuthenticated: false, error: "Invalid token" }
    }

    // Check if token exists in database and is not revoked
    const tokenRecord = await prisma.token.findFirst({
      where: {
        accessToken: token,
        isRevoked: false,
        isBlacklisted: false,
        accessTokenExpiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            nickname: true,
            avatar: true,
            verified: true,
            lastSeenAt: true
          }
        }
      }
    })

    if (!tokenRecord) {
      return { isAuthenticated: false, error: "Token not found or expired" }
    }

    // Update last used time and user last seen
    await prisma.$transaction([
      prisma.token.update({
        where: { id: tokenRecord.id },
        data: { lastUsedAt: new Date() }
      }),
      prisma.user.update({
        where: { id: tokenRecord.userId },
        data: { lastSeenAt: new Date() }
      })
    ])

    return {
      isAuthenticated: true,
      user: tokenRecord.user
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { isAuthenticated: false, error: "Authentication failed" }
  }
}

export function requireAuth() {
  return async (request: NextRequest) => {
    const auth = await authenticateToken(request)
    
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { error: auth.error || "Authentication required" },
        { status: 401 }
      )
    }

    return null // Continue to the actual handler
  }
}

export async function optionalAuth(request: NextRequest) {
  const auth = await authenticateToken(request)
  return auth.isAuthenticated ? auth.user : null
}

// Higher-order function to wrap API handlers with authentication
export function withAuth<T extends any[]>(
  handler: (request: NextRequest, auth: { user: any }, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T) => {
    const auth = await authenticateToken(request)
    
    if (!auth.isAuthenticated) {
      return NextResponse.json(
        { error: auth.error || "Authentication required" },
        { status: 401 }
      )
    }

    return handler(request, { user: auth.user }, ...args)
  }
}
