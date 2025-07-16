
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios-config';
import { useToast } from '@/hooks/use-toast';
import { Post } from '@/features/posts/types/post-type';

interface InfinitePostsData {
  pages: {
    posts: Post[];
    hasMore: boolean;
    nextPage?: number;
    total: number;
  }[];
  pageParams: unknown[];
}

export const useFollowUser = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // 팔로우 뮤테이션
    const followMutation = useMutation({
        mutationFn: async (userId: string) => {
            const response = await apiClient.post(`/users/${userId}/follow`);
            return response.data;
        },
        onMutate: async (targetUserId: string) => {
            // 쿼리 취소
            await queryClient.cancelQueries({ queryKey: ['posts'] });
            
            // 이전 데이터 백업
            const previousPostsData = queryClient.getQueryData<InfinitePostsData>(['posts']);
            
            // Optimistic update - 즉시 UI 업데이트
            if (previousPostsData) {
                const newPostsData = {
                    ...previousPostsData,
                    pages: previousPostsData.pages.map(page => ({
                        ...page,
                        posts: page.posts.map(post =>
                            post.author.id === targetUserId
                                ? { ...post, isFollowedByCurrentUser: true }
                                : post
                        ),
                    })),
                };
                queryClient.setQueryData(['posts'], newPostsData);
            }
            
            return { previousPostsData };
        },
        onError: (error: any, targetUserId, context) => {
            console.error('Follow error:', error);
            
            // 에러 발생 시 이전 상태로 롤백
            if (context?.previousPostsData) {
                queryClient.setQueryData(['posts'], context.previousPostsData);
            }
            
            toast({ 
                title: "오류", 
                description: "팔로우 중 오류가 발생했습니다.", 
                variant: "destructive" 
            });
        },
        onSuccess: () => {
            toast({ 
                title: "성공", 
                description: "사용자를 팔로우했습니다." 
            });
        },
    });

    // 언팔로우 뮤테이션
    const unfollowMutation = useMutation({
        mutationFn: async (userId: string) => {
            const response = await apiClient.delete(`/users/${userId}/follow`);
            return response.data;
        },
        onMutate: async (targetUserId: string) => {
            // 쿼리 취소
            await queryClient.cancelQueries({ queryKey: ['posts'] });
            
            // 이전 데이터 백업
            const previousPostsData = queryClient.getQueryData<InfinitePostsData>(['posts']);
            
            // Optimistic update - 즉시 UI 업데이트
            if (previousPostsData) {
                const newPostsData = {
                    ...previousPostsData,
                    pages: previousPostsData.pages.map(page => ({
                        ...page,
                        posts: page.posts.map(post =>
                            post.author.id === targetUserId
                                ? { ...post, isFollowedByCurrentUser: false }
                                : post
                        ),
                    })),
                };
                queryClient.setQueryData(['posts'], newPostsData);
            }
            
            return { previousPostsData };
        },
        onError: (error: any, targetUserId, context) => {
            console.error('Unfollow error:', error);
            
            // 에러 발생 시 이전 상태로 롤백
            if (context?.previousPostsData) {
                queryClient.setQueryData(['posts'], context.previousPostsData);
            }
            
            toast({ 
                title: "오류", 
                description: "언팔로우 중 오류가 발생했습니다.", 
                variant: "destructive" 
            });
        },
        onSuccess: () => {
            toast({ 
                title: "성공", 
                description: "사용자를 언팔로우했습니다." 
            });
        },
    });

    return {
        follow: followMutation.mutate,
        unfollow: unfollowMutation.mutate,
        isFollowing: followMutation.isPending,
        isUnfollowing: unfollowMutation.isPending,
    };
};
