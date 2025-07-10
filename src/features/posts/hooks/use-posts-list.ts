
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { PostsAPI } from "../api/post-api"
import { UsePostsParams } from "../types/post-type"
import { useToast } from "@/hooks/use-toast"

export function usePostsList(params: UsePostsParams = {}) {
  return useInfiniteQuery({
    queryKey: ["posts", params],
    queryFn: ({ pageParam = 1 }) =>
      PostsAPI.getPosts({
        ...params,
        page: pageParam,
        limit: params.limit || 10,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: PostsAPI.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      toast({
        title: "게시글 작성 완료",
        description: "게시글이 성공적으로 작성되었습니다.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "게시글 작성 실패",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
