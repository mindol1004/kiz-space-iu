"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, User, Heart, Mail, Lock } from "lucide-react"
import { useSignup } from "../hooks/use-signup"
import { REGIONS, INTEREST_TAGS, AGE_GROUPS } from "@/shared/constants/common-data"
import type { SignupFormData, Child } from "../types/auth-types"
import { useValidateStep, useValidateEmail, useValidatePassword, useValidateNickname } from "@/features/auth/hooks/use-validation"

export function SignupForm() {
  const { signup, isLoading, error, reset } = useSignup()
  const { validateStep } = useValidateStep()
  const { validateEmail } = useValidateEmail()
  const { validatePassword } = useValidatePassword()
  const { validateNickname } = useValidateNickname()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    region: "",
    children: [],
    interests: [],
    profileImage: "",
    bio: "",
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (validateStep(currentStep, formData)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (validateStep(currentStep, formData)) {
      await signup(formData)
    }
  }

  const addChild = () => {
    const newChild: Child = {
      id: Date.now().toString(),
      name: "",
      birthDate: "",
      gender: "",
      ageGroup: "",
      age: ""
    }
    setFormData((prev) => ({
      ...prev,
      children: [...prev.children, newChild],
    }))
  }

  const updateChild = (id: string, field: keyof Child, value: string) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.map((child) => (child.id === id ? { ...child, [field]: value } : child)),
    }))
  }

  const removeChild = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((child) => child.id !== id),
    }))
  }

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className={`pl-10 ${!validateEmail(formData.email) && formData.email ? "border-red-500" : ""}`}
                />
              </div>
              {!validateEmail(formData.email) && formData.email && (
                <p className="text-sm text-red-500">올바른 이메일 형식을 입력해주세요.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="8자 이상, 영문+숫자 조합"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className={`pl-10 ${!validatePassword(formData.password) && formData.password ? "border-red-500" : ""}`}
                />
              </div>
              {!validatePassword(formData.password) && formData.password && (
                <p className="text-sm text-red-500">8자 이상, 영문과 숫자를 포함해주세요.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`pl-10 ${
                    formData.password !== formData.confirmPassword && formData.confirmPassword ? "border-red-500" : ""
                  }`}
                />
              </div>
              {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                <p className="text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="nickname"
                  placeholder="2-20자 이내로 입력해주세요"
                  value={formData.nickname}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
                  className={`pl-10 ${!validateNickname(formData.nickname) && formData.nickname ? "border-red-500" : ""}`}
                />
              </div>
              {!validateNickname(formData.nickname) && formData.nickname && (
                <p className="text-sm text-red-500">2-20자 이내로 입력해주세요.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>지역</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="거주 지역을 선택해주세요" />
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

            <div className="space-y-2">
              <Label htmlFor="bio">자기소개 (선택)</Label>
              <Textarea
                id="bio"
                placeholder="간단한 자기소개를 작성해주세요"
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              자녀 정보를 등록하면 연령대에 맞는 콘텐츠를 추천받을 수 있어요.
            </p>

            {formData.children.map((child, index) => (
              <Card key={child.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">자녀 {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChild(child.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>이름</Label>
                      <Input
                        placeholder="자녀 이름"
                        value={child.name}
                        onChange={(e) => updateChild(child.id, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>생년월일</Label>
                      <Input
                        type="date"
                        value={child.birthDate}
                        onChange={(e) => updateChild(child.id, "birthDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>성별</Label>
                      <Select value={child.gender} onValueChange={(value) => updateChild(child.id, "gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="성별 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">남자</SelectItem>
                          <SelectItem value="female">여자</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>연령대</Label>
                      <Select
                        value={child.ageGroup}
                        onValueChange={(value) => updateChild(child.id, "ageGroup", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="연령대 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {AGE_GROUPS.map((group) => (
                            <SelectItem key={group.value} value={group.value}>
                              {group.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Button variant="outline" onClick={addChild} className="w-full border-dashed bg-transparent">
              자녀 추가
            </Button>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">관심 있는 주제를 선택하면 맞춤 콘텐츠를 추천받을 수 있어요.</p>

            <div className="grid grid-cols-2 gap-2">
              {INTEREST_TAGS.map((interest) => (
                <div
                  key={interest}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.interests.includes(interest)
                      ? "bg-pink-50 border-pink-200"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.interests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                    />
                    <span className="text-sm">{interest}</span>
                  </div>
                </div>
              ))}
            </div>

            {formData.interests.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">선택된 관심사:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
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
            <CardTitle className="text-center">KIZ-SPACE 회원가입</CardTitle>
            <CardDescription className="text-center">
              단계 {currentStep} / {totalSteps}
            </CardDescription>
            <Progress value={progress} className="w-full" />
          </CardHeader>

          <CardContent className="space-y-6">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error.message}</div>}

            {renderStep()}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep, formData)}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  다음
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateStep(currentStep, formData) || isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  {isLoading ? "가입 중..." : "가입 완료"}
                </Button>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{" "}
                <a href="/login" className="text-pink-500 hover:text-pink-600 font-medium">
                  로그인
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
