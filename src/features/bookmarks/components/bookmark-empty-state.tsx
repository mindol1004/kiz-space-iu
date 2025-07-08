"use client"

import { Bookmark, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
          마음에 드는 게시물을 북마크해보세요.
          <br />
          나중에 쉽게 다시 찾아볼 수 있어요!
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Heart className="h-4 w-4 mr-2" />
            인기 게시물 보기
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            게시물 둘러보기
          </Button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg max-w-md">
          <p className="text-sm text-gray-600">
            💡 <strong>팁:</strong> 게시물의 북마크 아이콘을 클릭하면 여기에 저장됩니다!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
