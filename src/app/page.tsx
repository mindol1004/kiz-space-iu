"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/shared/stores/auth-store"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, Users, MessageCircle, Star } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/feed")
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null // 리다이렉트 중
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* 헤더 */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              KIZ-SPACE
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">로그인</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                회원가입
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              함께 키우는{" "}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                육아 이야기
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              KIZ-SPACE에서 다른 부모들과 소중한 육아 경험을 나누고, 함께 성장해보세요.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-lg px-8 py-3"
              >
                지금 시작하기
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                둘러보기
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* 특징 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">커뮤니티</h3>
            <p className="text-gray-600">같은 고민을 가진 부모들과 소통하고 정보를 공유하세요.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">실시간 채팅</h3>
            <p className="text-gray-600">궁금한 것이 있을 때 바로 물어보고 답변을 받아보세요.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">전문 정보</h3>
            <p className="text-gray-600">검증된 육아 정보와 전문가의 조언을 만나보세요.</p>
          </div>
        </motion.div>

        {/* 통계 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">함께하는 부모들</h2>
            <p className="text-gray-600">이미 많은 부모들이 KIZ-SPACE에서 소중한 경험을 나누고 있어요</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-500 mb-2">10,000+</div>
              <div className="text-gray-600">활성 사용자</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">50,000+</div>
              <div className="text-gray-600">공유된 게시글</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-500 mb-2">200+</div>
              <div className="text-gray-600">활성 그룹</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">24/7</div>
              <div className="text-gray-600">언제든 소통</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 푸터 */}
      <footer className="container mx-auto px-4 py-8 mt-20">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 KIZ-SPACE. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  )
}