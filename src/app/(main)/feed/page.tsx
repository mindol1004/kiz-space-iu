"use client"

import { motion } from "framer-motion"
import { PostCard } from "@/features/posts/components/post-card"
import { PostFilters } from "@/features/posts/components/post-filters"
import { CreatePostDialog } from "@/features/posts/components/create-post-dialog"
import { usePosts } from "@/hooks/use-posts"
import { Loader2 } from "lucide-react"

export default function FeedPage() {
  const { data, isLoading, error } = usePosts()

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">피드</h1>
          <CreatePostDialog />
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
          <CreatePostDialog />
        </div>
        <PostFilters />
        <div className="text-center py-8">
          <p className="text-red-500">게시글을 불러오는데 실패했습니다.</p>
          <p className="text-gray-600 text-sm mt-2">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    )
  }

  const posts = data?.posts || []

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">피드</h1>
        <CreatePostDialog />
      </div>

      <div className="p-4">
        <PostFilters />
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 px-4">
          <p className="text-gray-600">선택한 조건에 맞는 게시글이 없습니다.</p>
          <p className="text-gray-500 text-sm mt-2">다른 카테고리나 연령대를 선택해보세요!</p>
        </div>
      ) : (
        <div className="space-y-4 px-4 pb-20">
          {posts.map((post: any, index: number) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
