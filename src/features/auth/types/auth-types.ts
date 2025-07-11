export interface Child {
  id: string
  name: string
  age: number
  birthDate: string
  gender: "boy" | "girl" | ""
  ageGroup: string
}

export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
  nickname: string
  region: string
  interests: string[]
  children: Child[]
  bio: string
  profileImage: string
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface User {
  id: string
  email: string
  nickname: string
  region: string
  interests: string[]
  children: Child[]
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
