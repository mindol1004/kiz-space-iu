export interface PopularGroup {
  id: string
  name: string
  description: string
  memberCount: number
  category: string
  isJoined: boolean
}

export interface TrendingTag {
  id: string
  name: string
  count: number
  growth: number
}

export interface WeeklyEvent {
  id: string
  title: string
  description: string
  date: Date
  participants: number
  category: string
}
