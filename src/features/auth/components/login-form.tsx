
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Mail, Lock } from "lucide-react"
import { useLogin } from "../hooks/use-auth"
import { useAuthStore } from "@/shared/stores/auth-store"
import { cookieUtils } from "@/lib/cookie"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const loginMutation = useLogin()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  // 컴포넌트 마운트시 인증 상태 확인
  useEffect(() => {
    const checkExistingAuth = () => {
      const token = cookieUtils.get('accessToken')
      const userInfo = cookieUtils.get('userInfo')
      
      console.log('LoginForm: Checking existing auth', { hasToken: !!token, hasUserInfo: !!userInfo, isAuthenticated, hasUser: !!user })

      if (token && userInfo && !isTokenExpired(token)) {
        console.log('LoginForm: User already authenticated, redirecting to feed')
        router.replace('/feed')
        return
      }
      
      setIsCheckingAuth(false)
    }

    // 토큰 만료 체크 함수
    const isTokenExpired = (token: string): boolean => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Math.floor(Date.now() / 1000)
        return payload.exp && payload.exp < currentTime
      } catch (error) {
        return true
      }
    }

    // 작은 딜레이 후 체크 (상태 동기화 대기)
    const timer = setTimeout(checkExistingAuth, 100)
    return () => clearTimeout(timer)
  }, [router, isAuthenticated, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim()) {
      return
    }

    console.log('LoginForm: Submitting login form')
    loginMutation.mutate({ email, password })
  }

  // 인증 체크 중인 경우 로딩 표시
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">인증 상태 확인 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900">KIZ-SPACE</h1>
          <p className="text-gray-600 mt-2">안전한 육아 커뮤니티에 오신 것을 환영합니다</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>계정에 로그인하여 다른 부모들과 소통해보세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loginMutation.isPending}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loginMutation.isPending}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                disabled={loginMutation.isPending || !email.trim() || !password.trim()}
              >
                {loginMutation.isPending ? "로그인 중..." : "로그인"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                계정이 없으신가요?{" "}
                <a href="/signup" className="text-pink-500 hover:text-pink-600 font-medium">
                  회원가입
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
