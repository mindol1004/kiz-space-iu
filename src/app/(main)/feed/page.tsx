
"use client"

import { motion } from "framer-motion"
import { PostCard } from "@/features/posts/components/post-card"
import { PostFilters } from "@/features/posts/components/post-filters"
import { CreatePostDialog } from "@/features/posts/components/create-post-dialog"
import { usePosts } from "@/features/posts/hooks/use-posts"
import { usePostStore } from "@/shared/stores/post-store"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function FeedPage() {
  const { selectedCategory, selectedAgeGroup } = usePostStore()
  const { 
    posts, 
    isLoading, 
    error, 
    hasMore, 
    fetchNextPage, 
    isFetchingNextPage,
    refetch,
    isRefetching
  } = usePosts({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    ageGroup: selectedAgeGroup !== "all" ? selectedAgeGroup : undefined,
  })

  // 필터가 변경될 때마다 데이터 새로고침
  useEffect(() => {
    refetch()
  }, [selectedCategory, selectedAgeGroup, refetch])

  const handleRefresh = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">피드</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefetching}
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            </Button>
            <CreatePostDialog />
          </div>
        </div>
        <PostFilters />
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
          <span className="ml-2 text-gray-600">게시글을 불러오는 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">피드</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefetching}
            >
              <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            </Button>
            <CreatePostDialog />
          </div>
        </div>
        <PostFilters />
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">게시글을 불러오는데 실패했습니다.</p>
          <p className="text-gray-600 text-sm mb-4">잠시 후 다시 시도해주세요.</p>
          <Button onClick={handleRefresh} variant="outline">
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">피드</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
          <CreatePostDialog />
        </div>
      </div>

      <div className="p-4">
        <PostFilters />
      </div>

      {isRefetching && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-pink-500 mr-2" />
          <span className="text-sm text-gray-600">새로고침 중...</span>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-8 px-4">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
          </div>
          <p className="text-gray-600 mb-2">선택한 조건에 맞는 게시글이 없습니다.</p>
          <p className="text-gray-500 text-sm mb-4">다른 카테고리나 연령대를 선택해보세요!</p>
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                const postStore = usePostStore.getState()
                postStore.setSelectedCategory("all")
                postStore.setSelectedAgeGroup("all")
              }}
            >
              전체 게시글 보기
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 px-4 pb-20">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}

          {hasMore && (
            <div className="flex justify-center py-4">
              <Button 
                onClick={() => fetchNextPage()} 
                disabled={isFetchingNextPage} 
                variant="outline"
                className="w-full"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    로딩 중...
                  </>
                ) : (
                  "더 보기"
                )}
              </Button>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">모든 게시글을 확인했습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
