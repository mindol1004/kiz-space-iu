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
  { value: "ALL", label: "전체" },
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
