import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { PostsAPI } from "../api/post-api"
import { UsePostsParams } from "../types/post-type"
import { useToast } from "@/hooks/use-toast"

export function usePostsList(params: UsePostsParams = {}) {
  const query = useInfiniteQuery({
    queryKey: ["posts", params],
    queryFn: ({ pageParam = 1 }) => 
      PostsAPI.getPosts({
        ...params,
        page: pageParam,
        limit: 10
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? (lastPage.nextPage || 1) : undefined
    },
    initialPageParam: 1,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  })

  return {
    ...query,
    posts: query.data?.pages.flatMap(page => page.posts) || [],
  }
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (postId: string) => PostsAPI.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "게시글 삭제 완료",
        description: "게시글이 성공적으로 삭제되었습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "게시글 삭제 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}