"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Heart, Baby, Users, Shield, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import type { SignupFormData, Child } from "../types/auth-types"
import { INTEREST_TAGS, REGIONS } from "../data/signup-data"
import { useAuth } from "../hooks/use-auth"

export default function SignupForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    region: "",
    interests: [],
    children: [],
  })

  const [newChild, setNewChild] = useState({
    name: "",
    age: "",
    gender: "boy" as "boy" | "girl",
  })

  const { register, isLoading } = useAuth()

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleAddChild = () => {
    if (newChild.name && newChild.age) {
      const child: Child = {
        id: Date.now().toString(),
        ...newChild,
      }
      setFormData((prev) => ({
        ...prev,
        children: [...prev.children, child],
      }))
      setNewChild({ name: "", age: "", gender: "boy" })
    }
  }

  const handleRemoveChild = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((c) => c.id !== id),
    }))
  }

  const handleSubmit = async () => {
    await register({
      email: formData.email,
      password: formData.password,
      nickname: formData.nickname,
      location: formData.region,
      interests: formData.interests,
    })
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* 헤더 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              KIZ-SPACE
            </h1>
          </div>
          <p className="text-gray-600">안전한 육아 커뮤니티에 참여하세요</p>
        </motion.div>

        {/* 진행 단계 표시 */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= num ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {num}
              </div>
              {num < 4 && (
                <div className={`w-8 h-0.5 transition-colors ${step > num ? "bg-pink-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* 회원가입 폼 */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                {step === 1 && "계정 정보"}
                {step === 2 && "기본 정보"}
                {step === 3 && "자녀 정보"}
                {step === 4 && "관심사 선택"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "로그인에 사용할 계정 정보를 입력해주세요"}
                {step === 2 && "프로필에 표시될 기본 정보를 입력해주세요"}
                {step === 3 && "자녀 정보를 추가해주세요 (선택사항)"}
                {step === 4 && "관심있는 육아 주제를 선택해주세요"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Step 1: 계정 정보 */}
              {step === 1 && (
                <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div>
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="8자 이상 입력해주세요"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="비밀번호를 다시 입력해주세요"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: 기본 정보 */}
              {step === 2 && (
                <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div>
                    <Label htmlFor="nickname">닉네임</Label>
                    <Input
                      id="nickname"
                      placeholder="커뮤니티에서 사용할 닉네임"
                      value={formData.nickname}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">거주지역</Label>
                    <Select
                      value={formData.region}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="거주지역을 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              )}

              {/* Step 3: 자녀 정보 */}
              {step === 3 && (
                <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Baby className="w-4 h-4" />
                      자녀 추가
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="childName">이름</Label>
                        <Input
                          id="childName"
                          placeholder="자녀 이름"
                          value={newChild.name}
                          onChange={(e) => setNewChild((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="childAge">나이</Label>
                        <Select
                          value={newChild.age}
                          onValueChange={(value) => setNewChild((prev) => ({ ...prev, age: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="나이" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 13 }, (_, i) => (
                              <SelectItem key={i} value={`${i}세`}>
                                {i}세
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Label>성별</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={newChild.gender === "boy" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewChild((prev) => ({ ...prev, gender: "boy" }))}
                        >
                          남아
                        </Button>
                        <Button
                          type="button"
                          variant={newChild.gender === "girl" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setNewChild((prev) => ({ ...prev, gender: "girl" }))}
                        >
                          여아
                        </Button>
                      </div>
                    </div>
                    <Button type="button" onClick={handleAddChild} className="w-full" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      자녀 추가
                    </Button>
                  </div>

                  {/* 추가된 자녀 목록 */}
                  {formData.children.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">추가된 자녀</h4>
                      {formData.children.map((child) => (
                        <div key={child.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{child.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {child.age} • {child.gender === "boy" ? "남아" : "여아"}
                            </span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveChild(child.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: 관심사 선택 */}
              {step === 4 && (
                <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div>
                    <h4 className="font-medium mb-3">관심있는 육아 주제를 선택해주세요</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {INTEREST_TAGS.map((tag) => (
                        <motion.div key={tag} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Badge
                            variant={formData.interests.includes(tag) ? "default" : "outline"}
                            className={`cursor-pointer p-2 justify-center transition-colors ${
                              formData.interests.includes(tag) ? "bg-pink-500 hover:bg-pink-600" : "hover:bg-pink-50"
                            }`}
                            onClick={() => handleInterestToggle(tag)}
                          >
                            {tag}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">선택한 관심사: {formData.interests.length}개</p>
                  </div>
                </motion.div>
              )}

              {/* 버튼 */}
              <div className="flex gap-2 pt-4">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
                    이전
                  </Button>
                )}
                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    다음
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {isLoading ? "가입 중..." : "가입 완료"}
                  </Button>
                )}
              </div>

              {/* 로그인 링크 */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  이미 계정이 있으신가요?{" "}
                  <Link href="/(auth)/login" className="text-pink-600 hover:text-pink-700 font-medium">
                    로그인하기
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 하단 안내 */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>안전하고 신뢰할 수 있는 육아 커뮤니티</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
