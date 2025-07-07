"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Heart,
  Shield,
  Users,
  MessageCircle,
  Star,
  Baby,
  BookOpen,
  Camera,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const scaleIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5, type: "spring", stiffness: 200 },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-20"
          />
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full opacity-20"
          />
        </div>

        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-8 shadow-lg"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>

            {/* Title Animation */}
            <motion.h1
              {...fadeInUp}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            >
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                KIZ-SPACE
              </span>
            </motion.h1>

            <motion.p
              {...fadeInUp}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              안전하고 신뢰할 수 있는 육아 커뮤니티에서
              <br />
              <span className="text-pink-500 font-semibold">소중한 경험을 나누고</span> 함께 성장해보세요
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  로그인
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent"
                >
                  회원가입
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-3 gap-8 max-w-md mx-auto"
            >
              {[
                { number: "10K+", label: "활성 부모" },
                { number: "50K+", label: "공유된 팁" },
                { number: "99%", label: "만족도" },
              ].map((stat, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <div className="text-2xl font-bold text-pink-500">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              왜 <span className="text-pink-500">KIZ-SPACE</span>를 선택해야 할까요?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              안전하고 신뢰할 수 있는 환경에서 육아의 모든 순간을 함께 나누세요
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Shield,
                title: "안전한 환경",
                description: "검증된 부모들만의 안전한 커뮤니티",
                color: "from-green-400 to-green-600",
              },
              {
                icon: Users,
                title: "신뢰할 수 있는 정보",
                description: "실제 경험을 바탕으로 한 검증된 육아 정보",
                color: "from-blue-400 to-blue-600",
              },
              {
                icon: MessageCircle,
                title: "실시간 소통",
                description: "언제든지 궁금한 것을 물어보고 답변받기",
                color: "from-purple-400 to-purple-600",
              },
              {
                icon: Heart,
                title: "따뜻한 공감",
                description: "육아의 기쁨과 어려움을 함께 나누는 공간",
                color: "from-pink-400 to-pink-600",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full mb-4`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              다양한 <span className="text-purple-500">카테고리</span>로 정보를 찾아보세요
            </h2>
            <p className="text-xl text-gray-600">연령별, 주제별로 정리된 육아 정보를 쉽게 찾을 수 있어요</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: Baby, label: "신생아 케어", color: "bg-pink-100 text-pink-600" },
              { icon: BookOpen, label: "교육 정보", color: "bg-blue-100 text-blue-600" },
              { icon: Camera, label: "성장 기록", color: "bg-green-100 text-green-600" },
              { icon: Users, label: "놀이 활동", color: "bg-purple-100 text-purple-600" },
              { icon: Shield, label: "건강 관리", color: "bg-red-100 text-red-600" },
              { icon: MessageCircle, label: "고민 상담", color: "bg-yellow-100 text-yellow-600" },
              { icon: Star, label: "육아 용품", color: "bg-indigo-100 text-indigo-600" },
              { icon: Heart, label: "일상 공유", color: "bg-rose-100 text-rose-600" },
            ].map((category, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 ${category.color} rounded-full mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <category.icon className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-gray-900">{category.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-500">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">실제 부모들의 이야기</h2>
            <p className="text-xl text-pink-100">KIZ-SPACE와 함께하는 부모들의 생생한 후기</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "민지맘",
                age: "2세 아이 엄마",
                content: "신생아 케어 정보가 정말 도움이 되었어요. 특히 밤중 수유 팁은 정말 유용했습니다!",
                rating: 5,
              },
              {
                name: "서준이엄마",
                age: "4세 아이 엄마",
                content: "편식하는 아이 때문에 고민이 많았는데, 여기서 만난 엄마들 덕분에 해결했어요.",
                rating: 5,
              },
              {
                name: "예준맘",
                age: "7세 아이 엄마",
                content: "초등학교 입학 준비 정보를 얻을 수 있어서 너무 감사해요. 안전한 커뮤니티라 믿고 참여해요.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="bg-white/90 backdrop-blur-sm border-0">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.age}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              지금 바로 <span className="text-pink-500">KIZ-SPACE</span>와 함께하세요!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              무료로 가입하고 수많은 부모들과 소중한 육아 경험을 나누어보세요
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-12 py-4 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  무료로 시작하기
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              {["무료 가입", "안전한 커뮤니티", "실시간 소통", "전문가 조언"].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {benefit}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">KIZ-SPACE</h3>
            <p className="text-gray-400 mb-6">안전한 육아 커뮤니티</p>
            <p className="text-sm text-gray-500">© 2024 KIZ-SPACE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
