
import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios-config';
import { useToast } from '@/hooks/use-toast';
import { Post } from '@/features/posts/types/post-type';

interface InfinitePostsData {
  pages: {
    posts: Post[];
    [key: string]: any;
  }[];
  pageParams: any[];
}

export const useFollowUser = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // 팔로우 뮤테이션
    const followMutation = useMutation({
        mutationFn: (userId: string) => apiClient.post(`/users/${userId}/follow`),
        onMutate: async (targetUserId: string) => {
            await queryClient.cancelQueries({ queryKey: ['posts'] });
            const previousPostsData = queryClient.getQueryData<InfinitePostsData>(['posts']);
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
        onError: (err, variables, context) => {
            if (context?.previousPostsData) {
                queryClient.setQueryData(['posts'], context.previousPostsData);
            }
            toast({ title: "오류", description: `팔로우 중 오류가 발생했습니다.`, variant: "destructive" });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] }); // Re-added
        },
        onSuccess: () => {
            toast({ title: "성공", description: `사용자를 팔로우했습니다.` });
        },
    });

    // 언팔로우 뮤테이션
    const unfollowMutation = useMutation({
        mutationFn: (userId: string) => apiClient.delete(`/users/${userId}/follow`),
        onMutate: async (targetUserId: string) => {
            await queryClient.cancelQueries({ queryKey: ['posts'] });
            const previousPostsData = queryClient.getQueryData<InfinitePostsData>(['posts']);
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
        onError: (err, variables, context) => {
            if (context?.previousPostsData) {
                queryClient.setQueryData(['posts'], context.previousPostsData);
            }
            toast({ title: "오류", description: `언팔로우 중 오류가 발생했습니다.`, variant: "destructive" });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] }); // Re-added
        },
        onSuccess: () => {
            toast({ title: "성공", description: `사용자를 언팔로우했습니다.` });
        },
    });

    return {
        follow: followMutation.mutate,
        unfollow: unfollowMutation.mutate,
        isFollowing: followMutation.isPending,
        isUnfollowing: unfollowMutation.isPending,
    };
};
