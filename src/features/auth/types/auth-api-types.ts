
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
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

export interface LoginResponse {
  user: {
    id: string
    email: string
    nickname: string
    region: string
    interests: string[]
    children: any[]
    avatar?: string
    verified?: boolean
    createdAt: Date
    updatedAt: Date
  }
  token?: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    nickname: string
  }
}

export interface LogoutResponse {
  success: boolean
  message: string
}

export interface CheckAuthResponse {
  user: {
    id: string
    email: string
    nickname: string
    region: string
    interests: string[]
    children: any[]
    avatar?: string
    verified?: boolean
    createdAt: Date
    updatedAt: Date
  }
  authenticated: boolean
}
