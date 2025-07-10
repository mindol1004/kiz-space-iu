
import { NextRequest } from "next/server"
import { verifyAccessToken } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"

export interface UserFromCookie {
  id: string
  email: string
  nickname: string
  avatar?: string
  verified: boolean
}

export async function getUserFromCookies(request: NextRequest): Promise<UserFromCookie | null> {
  try {
    // Get access token from cookie or Authorization header
    const cookieToken = request.cookies.get('accessToken')?.value
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7)
      : cookieToken

    if (!token) {
      return null
    }

    // Verify JWT token
    const payload = verifyAccessToken(token)
    if (!payload) {
      return null
    }

    // Get user data from database using userId from JWT token
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        verified: true
      }
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      verified: user.verified
    }
  } catch (error) {
    console.error("Error getting user from cookies:", error)
    return null
  }
}

export function getUserIdFromCookies(request: NextRequest): string | undefined {
  try {
    // Get access token from cookie or Authorization header
    const cookieToken = request.cookies.get('accessToken')?.value
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7)
      : cookieToken

    if (!token) {
      return undefined
    }

    // Verify JWT token and get userId
    const payload = verifyAccessToken(token)
    return payload?.userId || undefined
  } catch (error) {
    console.error("Error getting user ID from cookies:", error)
    return undefined
  }
}
