import { apiClient } from '@/lib/axios-config'
import { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  RegisterResponse, 
  LogoutResponse, 
  CheckAuthResponse 
} from '../types/auth-api-types'

export class AuthAPI {
  static async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data)
    return response.data
  }

  static async logout(): Promise<LogoutResponse> {
    const response = await apiClient.post<LogoutResponse>('/auth/logout')
    return response.data
  }

  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data)
    return response.data
  }

  static async checkAuth(): Promise<CheckAuthResponse> {
    const response = await apiClient.get<CheckAuthResponse>('/auth/check')
    return response.data
  }
}