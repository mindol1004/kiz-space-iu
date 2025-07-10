
export const CATEGORIES = [
  { value: "PLAY", label: "놀이/활동" },
  { value: "HEALTH", label: "건강/안전" },
  { value: "EDUCATION", label: "교육" },
  { value: "FOOD", label: "식사/영양" },
  { value: "PRODUCTS", label: "육아용품" },
  { value: "ADVICE", label: "고민상담" },
  { value: "PREGNANCY", label: "임신" },
  { value: "NEWBORN", label: "신생아" },
  { value: "LIFESTYLE", label: "라이프스타일" },
]

// Helper functions for posts
export const getCategoryLabel = (category: string): string => {
  const categoryItem = CATEGORIES.find(c => c.value === category)
  return categoryItem ? categoryItem.label : category
}

export const getAgeGroupLabel = (ageGroup: string): string => {
  const ageGroupItem = AGE_GROUPS.find(a => a.value === ageGroup)
  return ageGroupItem ? ageGroupItem.label : ageGroup
}

export const AGE_GROUPS = [
  { value: "PREGNANCY", label: "임신" },
  { value: "NEWBORN_0_6M", label: "신생아 (0-6개월)" },
  { value: "INFANT_6_12M", label: "영아 (6-12개월)" },
  { value: "TODDLER_1_3Y", label: "유아 (1-3세)" },
  { value: "PRESCHOOL_3_5Y", label: "유치원 (3-5세)" },
  { value: "SCHOOL_5_8Y", label: "초등 저학년 (5-8세)" },
  { value: "TWEEN_8_12Y", label: "초등 고학년 (8-12세)" },
  { value: "ALL", label: "전체 연령" },
]

export const FILTER_CATEGORIES = [
  { value: "all", label: "전체" },
  ...CATEGORIES,
]

export const FILTER_AGE_GROUPS = [
  { value: "all", label: "전체 연령" },
  ...AGE_GROUPS,
]

export const INTEREST_TAGS = [
  "신생아케어",
  "유아놀이",
  "초등교육",
  "편식해결",
  "수면교육",
  "언어발달",
  "감정코칭",
  "창의놀이",
  "홈스쿨링",
  "영어교육",
  "수학교육",
  "독서교육",
  "체육활동",
  "음악교육",
  "미술활동",
  "요리활동",
  "장난감추천",
  "책추천",
  "외출준비",
  "안전용품",
  "성장발달",
]

export const REGIONS = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
]

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
  { id: "1", name: "서울 강남구 엄마들", members: 1234, category: "지역" },
  { id: "2", name: "홈스쿨링 모임", members: 856, category: "교육" },
  { id: "3", name: "워킹맘 소통방", members: 2341, category: "라이프" },
  { id: "4", name: "신생아 육아 정보", members: 1876, category: "연령별" },
]

export interface WeeklyEvent {
  id: string
  title: string
  description: string
  date: string
  bgColor: string
  textColor: string
  participants: number
  category: string
}

export const WEEKLY_EVENTS: WeeklyEvent[] = [
  {
    id: "1",
    title: "온라인 육아 세미나",
    description: "소아과 전문의와 함께하는 신생아 케어",
    date: "1월 20일 오후 2시",
    bgColor: "bg-gradient-to-r from-pink-50 to-purple-50",
    textColor: "text-pink-600",
    participants: 0,
    category: "건강"
  },
  {
    id: "2",
    title: "유아 요리 클래스",
    description: "아이와 함께하는 간단한 요리 만들기",
    date: "1월 22일 오전 10시",
    bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50",
    textColor: "text-orange-600",
    participants: 0,
    category: "요리"
  },
  {
    id: "3",
    title: "놀이터 모임",
    description: "동네 엄마들과 함께하는 야외 활동",
    date: "1월 25일 오후 3시",
    bgColor: "bg-gradient-to-r from-green-50 to-blue-50",
    textColor: "text-green-600",
    participants: 0,
    category: "야외활동"
  },
]

export interface PopularGroup {
  id: string
  name: string
  description: string
  memberCount: number
  category: string
  isJoined: boolean
}

export const MOCK_POPULAR_GROUPS: PopularGroup[] = [
  {
    id: "1",
    name: "신생아 케어 모임",
    description: "0-12개월 아기를 키우는 부모들의 모임",
    memberCount: 1234,
    category: "신생아",
    isJoined: false,
  },
  {
    id: "2",
    name: "워킹맘 소통방",
    description: "일하는 엄마들의 육아와 커리어 이야기",
    memberCount: 856,
    category: "워킹맘",
    isJoined: true,
  },
  {
    id: "3",
    name: "유치원 준비반",
    description: "유치원 입학을 준비하는 부모들",
    memberCount: 642,
    category: "유치원",
    isJoined: false,
  },
]

export interface ChatRoom {
  id: string
  name: string
  type: "group" | "direct"
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  participants: number
  avatar: string
  isOnline?: boolean
}

export const MOCK_CHAT_ROOMS: ChatRoom[] = [
  {
    id: "1",
    name: "신생아 케어 모임",
    type: "group",
    lastMessage: "밤중 수유 팁 공유해주세요!",
    lastMessageTime: "2분 전",
    unreadCount: 3,
    participants: 24,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "김민지",
    type: "direct",
    lastMessage: "아이 이유식 레시피 감사해요 ❤️",
    lastMessageTime: "10분 전",
    unreadCount: 1,
    participants: 2,
    avatar: "/placeholder-user.jpg",
    isOnline: true,
  },
  {
    id: "3",
    name: "유치원 준비반",
    type: "group",
    lastMessage: "입학 준비물 리스트 공유드려요",
    lastMessageTime: "1시간 전",
    unreadCount: 0,
    participants: 18,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "박서연",
    type: "direct",
    lastMessage: "놀이터에서 만나요!",
    lastMessageTime: "2시간 전",
    unreadCount: 0,
    participants: 2,
    avatar: "/placeholder-user.jpg",
    isOnline: false,
  },
  {
    id: "5",
    name: "워킹맘 소통방",
    type: "group",
    lastMessage: "육아휴직 복직 준비 어떻게 하셨나요?",
    lastMessageTime: "3시간 전",
    unreadCount: 5,
    participants: 42,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "이지은",
    type: "direct",
    lastMessage: "아이 발열 관련 조언 감사해요",
    lastMessageTime: "5시간 전",
    unreadCount: 0,
    participants: 2,
    avatar: "/placeholder-user.jpg",
    isOnline: false,
  },
]

// Pagination and UI constants
export const DEFAULT_PAGE_SIZE = 10
export const MAX_TAGS_PER_POST = 5
export const MAX_IMAGES_PER_POST = 4
export const MAX_CONTENT_LENGTH = 1000
export const MAX_TAG_LENGTH = 20

// Messages
export const MESSAGES = {
  LOGIN_REQUIRED: "로그인이 필요합니다.",
  CONTENT_REQUIRED: "게시글 내용을 입력해주세요.",
  CATEGORY_REQUIRED: "카테고리를 선택해주세요.",
  AGE_GROUP_REQUIRED: "연령대를 선택해주세요.",
  TAG_LIMIT_REACHED: "태그는 최대 5개까지 추가할 수 있습니다.",
  POST_CREATED: "게시글이 성공적으로 작성되었습니다.",
  POST_FAILED: "게시글 작성에 실패했습니다.",
}
