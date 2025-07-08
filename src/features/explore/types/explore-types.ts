export interface PopularGroup {
  name: string
  members: number
  category: string
}

export interface WeeklyEvent {
  id: string
  title: string
  description: string
  date: string
  bgColor: string
  textColor: string
}

export interface ExploreData {
  trendingTags: string[]
  popularGroups: PopularGroup[]
  weeklyEvents: WeeklyEvent[]
}
