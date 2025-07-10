
interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  nickname: string
  region?: string
  children?: Array<{
    name: string
    age: number
    gender: string
  }>
  interests?: string[]
  profileImage?: string
  bio?: string
}

export class AuthAPI {
  static async login(data: LoginData) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "로그인에 실패했습니다")
    }

    return response.json()
  }

  static async logout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("로그아웃에 실패했습니다")
    }

    return response.json()
  }

  static async register(data: RegisterData) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "회원가입에 실패했습니다")
    }

    return response.json()
  }

  static async checkAuth() {
    const response = await fetch('/api/auth/check', {
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error("인증 확인에 실패했습니다")
    }
    
    return response.json()
  }
}
