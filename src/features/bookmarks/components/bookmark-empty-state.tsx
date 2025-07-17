"use client"

import { Bookmark, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BookmarkEmptyStateProps {
  hasSearch: boolean
  searchQuery?: string
}

export function BookmarkEmptyState({ hasSearch, searchQuery }: BookmarkEmptyStateProps) {
  if (hasSearch) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            '{searchQuery}'에 대한 북마크를 찾을 수 없습니다.
            <br />
            다른 키워드로 검색해보세요.
          </p>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            다시 검색하기
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
          <Bookmark className="h-10 w-10 text-pink-500" />
        </div>
        <h3 className="text-xl font-semibold mb-3">아직 북마크가 없어요</h3>
        <p className="text-gray-500 mb-8 max-w-md">
          마음에 드는 포스트를 북마크해보세요.
          <br />
          나중에 쉽게 찾아볼 수 있어요.
        </p>
        <Button variant="outline">
          <Bookmark className="h-4 w-4 mr-2" />
          포스트 둘러보기
        </Button>
      </CardContent>
    </Card>
  )
}