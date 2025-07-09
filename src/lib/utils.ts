import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "방금 전"
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`

  return date.toLocaleDateString("ko-KR")
}

export function getAgeGroupLabel(ageGroup: string): string {
  const labels = {
    "PREGNANCY": "임신",
    "NEWBORN_0_6M": "신생아 (0-6개월)",
    "INFANT_6_12M": "영아 (6-12개월)",
    "TODDLER_1_3Y": "유아 (1-3세)",
    "PRESCHOOL_3_5Y": "유치원 (3-5세)",
    "SCHOOL_5_8Y": "초등 저학년 (5-8세)",
    "TWEEN_8_12Y": "초등 고학년 (8-12세)",
    "ALL": "전체 연령",
    // 기존 형식 호환성
    "0-2": "영아 (0-2세)",
    "3-5": "유아 (3-5세)",
    "6-8": "초등 저학년 (6-8세)",
    "9-12": "초등 고학년 (9-12세)",
    all: "전체 연령",
  }
  return labels[ageGroup as keyof typeof labels] || ageGroup
}

export function getCategoryLabel(category: string): string {
  const labels = {
    "PREGNANCY": "임신",
    "NEWBORN": "신생아",
    "HEALTH": "건강/안전",
    "EDUCATION": "교육",
    "FOOD": "식사/영양",
    "PLAY": "놀이/활동",
    "PRODUCTS": "육아용품",
    "ADVICE": "고민상담",
    "LIFESTYLE": "라이프스타일",
    // 기존 형식 호환성
    play: "놀이/활동",
    health: "건강/안전",
    education: "교육",
    food: "식사",
    products: "육아용품",
    advice: "고민상담",
  }
  return labels[category as keyof typeof labels] || category
}
