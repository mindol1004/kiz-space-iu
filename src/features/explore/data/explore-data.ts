import type { PopularGroup, WeeklyEvent } from "../types/explore-types"

export const TRENDING_TAGS: string[] = [
  "신생아케어",
  "유아놀이",
  "초등교육",
  "편식해결",
  "수면교육",
  "장난감추천",
  "책추천",
  "외출준비",
  "안전용품",
  "성장발달",
]

export const POPULAR_GROUPS = [
  { name: "서울 강남구 엄마들", members: 1234, category: "지역" },
  { name: "홈스쿨링 모임", members: 856, category: "교육" },
  { name: "워킹맘 소통방", members: 2341, category: "라이프" },
  { name: "신생아 육아 정보", members: 1876, category: "연령별" },
]

export const WEEKLY_EVENTS: WeeklyEvent[] = [
  {
    id: "1",
    title: "온라인 육아 세미나",
    description: "소아과 전문의와 함께하는 신생아 케어",
    date: "1월 20일 오후 2시",
    bgColor: "bg-gradient-to-r from-pink-50 to-purple-50",
    textColor: "text-pink-600",
    participants: 0,
    category: ""
  },
  {
    id: "2",
    title: "강남구 엄마 모임",
    description: "카페에서 만나는 오프라인 모임",
    date: "1월 22일 오전 10시",
    bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
    textColor: "text-blue-600",
    participants: 0,
    category: ""
  },
]
