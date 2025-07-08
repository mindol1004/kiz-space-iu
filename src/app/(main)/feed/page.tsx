import { Suspense } from "react"
import { CreatePostDialog } from "@/features/posts/components/create-post-dialog"
import { PostCard } from "@/features/posts/components/post-card"
import { PostFilters } from "@/features/posts/components/post-filters"
import { Skeleton } from "@/components/ui/skeleton"
import { usePosts } from "@/features/posts/hooks/use-posts"

function FeedContent() {
  const { posts, isLoading, error } = usePosts()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">피드</h1>
        <CreatePostDialog />
      </div>

      <PostFilters />

      <Suspense fallback={<div>Loading...</div>}>
        <FeedContent />
      </Suspense>
    </div>
  )
}
