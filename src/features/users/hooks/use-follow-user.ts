
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios-config';
import { useToast } from '@/hooks/use-toast';

export const useFollowUser = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // 팔로우 뮤테이션
    const followMutation = useMutation({
        mutationFn: async (userId: string) => {
            const response = await apiClient.post(`/users/${userId}/follow`);
            return response.data;
        },
        onSuccess: () => {
            // 관련 쿼리 무효화하여 최신 데이터 가져오기
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast({ 
                title: "성공", 
                description: "사용자를 팔로우했습니다." 
            });
        },
        onError: (error: any) => {
            console.error('Follow error:', error);
            toast({ 
                title: "오류", 
                description: "팔로우 중 오류가 발생했습니다.", 
                variant: "destructive" 
            });
        },
    });

    // 언팔로우 뮤테이션
    const unfollowMutation = useMutation({
        mutationFn: async (userId: string) => {
            const response = await apiClient.delete(`/users/${userId}/follow`);
            return response.data;
        },
        onSuccess: () => {
            // 관련 쿼리 무효화하여 최신 데이터 가져오기
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast({ 
                title: "성공", 
                description: "사용자를 언팔로우했습니다." 
            });
        },
        onError: (error: any) => {
            console.error('Unfollow error:', error);
            toast({ 
                title: "오류", 
                description: "언팔로우 중 오류가 발생했습니다.", 
                variant: "destructive" 
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
