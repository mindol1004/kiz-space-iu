"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, User, MapPin, Baby, Heart } from "lucide-react"
import { useSignup } from "../hooks/use-signup"
import { regions, interests, ageGroups } from "../data/signup-data"
import type { SignupFormData, Child } from "../types/auth-types"

export function SignupForm() {
  const { signup, validateStep, validateEmail, validatePassword, validateNickname, isLoading, error, reset } =
    useSignup()
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
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-semibold">기본 정보</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className={!validateEmail(formData.email) && formData.email ? "border-red-500" : ""}
              />
              {!validateEmail(formData.email) && formData.email && (
                <p className="text-sm text-red-500">올바른 이메일 형식을 입력해주세요.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="8자 이상, 영문+숫자 조합"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className={!validatePassword(formData.password) && formData.password ? "border-red-500" : ""}
              />
              {!validatePassword(formData.password) && formData.password && (
                <p className="text-sm text-red-500">8자 이상, 영문과 숫자를 포함해주세요.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력해주세요"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className={
                  formData.password !== formData.confirmPassword && formData.confirmPassword ? "border-red-500" : ""
                }
              />
              {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                <p className="text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-semibold">프로필 정보</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                placeholder="2-20자 이내로 입력해주세요"
                value={formData.nickname}
                onChange={(e) => setFormData((prev) => ({ ...prev, nickname: e.target.value }))}
                className={!validateNickname(formData.nickname) && formData.nickname ? "border-red-500" : ""}
              />
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
                  {regions.map((region) => (
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
            <div className="flex items-center gap-2 mb-4">
              <Baby className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-semibold">자녀 정보 (선택)</h3>
            </div>

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
                          {ageGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
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
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-semibold">관심사 선택 (선택)</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">관심 있는 주제를 선택하면 맞춤 콘텐츠를 추천받을 수 있어요.</p>

            <div className="grid grid-cols-2 gap-2">
              {interests.map((interest) => (
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">KIZ-SPACE 회원가입</CardTitle>
        <CardDescription className="text-center">
          단계 {currentStep} / {totalSteps}
        </CardDescription>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent className="space-y-6">
        {error && <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>}

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
              className="flex items-center gap-2"
            >
              다음
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!validateStep(currentStep, formData) || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? "가입 중..." : "가입 완료"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
