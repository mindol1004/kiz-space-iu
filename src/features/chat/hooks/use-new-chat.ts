
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios-config';
import { User } from '@/features/auth/types/auth-types';
import { ChatRoom } from '../types/chat-types';

// API 호출 함수
const fetchMutualUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users/mutuals');
    return response.data;
};

const createDirectChat = async (targetUserId: string): Promise<ChatRoom> => {
    const response = await apiClient.post<ChatRoom>('/chat/rooms/direct', { targetUserId });
    return response.data;
};


export const useNewChat = (onSuccess?: (room: ChatRoom) => void) => {
    const queryClient = useQueryClient();

    // 상호 팔로우 사용자 목록을 가져오는 쿼리
    const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery<User[]>({
        queryKey: ['mutualUsers'],
        queryFn: fetchMutualUsers,
        staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    });

    // 1:1 채팅방을 생성하는 뮤테이션
    const { mutate: createChat, isPending: isCreatingChat } = useMutation({
        mutationFn: createDirectChat,
        onSuccess: (newRoom) => {
            // 채팅방 목록 쿼리를 무효화하여 최신 상태로 업데이트
            queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
            // 성공 콜백이 있으면 호출
            if (onSuccess) {
                onSuccess(newRoom);
            }
        },
        onError: (error) => {
            // 실제 앱에서는 토스트 메시지 등을 사용하여 사용자에게 오류를 알립니다.
            console.error("채팅방 생성 실패:", error);
        }
    });

    return {
        users: users || [],
        isLoadingUsers,
        usersError,
        createChat,
        isCreatingChat,
    };
};
