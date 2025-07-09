
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret'
const ACCESS_TOKEN_EXPIRES_IN = '15m'
const REFRESH_TOKEN_EXPIRES_IN = '7d'

export interface JWTPayload {
  userId: string
  email: string
  tokenId: string
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    issuer: 'parenting-app',
    audience: 'parenting-app-users'
  })
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: 'parenting-app',
    audience: 'parenting-app-users'
  })
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export function generateTokenId(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function getTokenExpirationDate(expiresIn: string): Date {
  const now = new Date()
  const match = expiresIn.match(/^(\d+)([mhd])$/)
  
  if (!match) {
    throw new Error('Invalid expires in format')
  }
  
  const [, amount, unit] = match
  const amountNum = parseInt(amount, 10)
  
  switch (unit) {
    case 'm':
      return new Date(now.getTime() + amountNum * 60 * 1000)
    case 'h':
      return new Date(now.getTime() + amountNum * 60 * 60 * 1000)
    case 'd':
      return new Date(now.getTime() + amountNum * 24 * 60 * 60 * 1000)
    default:
      throw new Error('Invalid time unit')
  }
}
