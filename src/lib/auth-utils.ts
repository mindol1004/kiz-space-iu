
import { NextRequest } from "next/server"
import { verifyAccessToken } from "@/lib/jwt"

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

    // Get user data from user cookie
    const userCookie = request.cookies.get('user')?.value
    if (!userCookie) {
      return null
    }

    const userData = JSON.parse(decodeURIComponent(userCookie))
    return {
      id: userData.id,
      email: userData.email,
      nickname: userData.nickname,
      avatar: userData.avatar,
      verified: userData.verified || false
    }
  } catch (error) {
    console.error("Error getting user from cookies:", error)
    return null
  }
}

export function getUserIdFromCookies(request: NextRequest): string | null {
  try {
    const userCookie = request.cookies.get('user')?.value
    if (!userCookie) {
      return null
    }

    const userData = JSON.parse(decodeURIComponent(userCookie))
    return userData.id || null
  } catch (error) {
    console.error("Error getting user ID from cookies:", error)
    return null
  }
}
