export const cookieUtils = {
  // 쿠키 값 가져오기
  get: (name: string): string | null => {
    if (typeof window === 'undefined') return null

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null
    }
    return null
  },

  // 쿠키 설정
  set: (name: string, value: string, options: {
    expires?: number | Date
    path?: string
    domain?: string
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
    httpOnly?: boolean
  } = {}) => {
    if (typeof window === 'undefined') return

    let cookieString = `${name}=${value}`

    if (options.expires) {
      if (typeof options.expires === 'number') {
        const date = new Date()
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000))
        cookieString += `; expires=${date.toUTCString()}`
      } else {
        cookieString += `; expires=${options.expires.toUTCString()}`
      }
    }

    if (options.path) cookieString += `; path=${options.path}`
    if (options.domain) cookieString += `; domain=${options.domain}`
    if (options.secure) cookieString += `; secure`
    if (options.sameSite) cookieString += `; sameSite=${options.sameSite}`
    if (options.httpOnly) cookieString += `; httpOnly`

    document.cookie = cookieString
  },

  // 쿠키 삭제
  remove: (name: string, path?: string, domain?: string) => {
    if (typeof window === 'undefined') return

    let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`
    if (path) cookieString += `; path=${path}`
    if (domain) cookieString += `; domain=${domain}`

    document.cookie = cookieString
  },

  // 모든 쿠키 가져오기
  getAll: (): Record<string, string> => {
    if (typeof window === 'undefined') return {}

    const cookies: Record<string, string> = {}
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=')
      if (name && value) {
        cookies[name] = value
      }
    })
    return cookies
  },

  // JWT 토큰 디코딩 (payload 부분만)
  decodeJWT: (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload
    } catch (error) {
      console.error('JWT decode failed:', error)
      return null
    }
  },

  // JWT 토큰 만료 체크
  isTokenExpired: (token: string): boolean => {
    const payload = cookieUtils.decodeJWT(token)
    if (!payload || !payload.exp) return true

    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  },

  // 토큰 만료까지 남은 시간 (초)
  getTokenExpiryTime: (token: string): number => {
    const payload = cookieUtils.decodeJWT(token)
    if (!payload || !payload.exp) return 0

    const currentTime = Math.floor(Date.now() / 1000)
    return Math.max(0, payload.exp - currentTime)
  }
}