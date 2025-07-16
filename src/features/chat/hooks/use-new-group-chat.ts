
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios-config';
import { User } from '@/features/auth/types/auth-types';
import { ChatRoom } from '../types/chat-types';

// API 호출 함수
const fetchMutualUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users/mutuals');
    return response.data;
};

interface CreateGroupChatParams {
    name: string;
    participantIds: string[];
}

const createGroupChat = async ({ name, participantIds }: CreateGroupChatParams): Promise<ChatRoom> => {
    const response = await apiClient.post<ChatRoom>('/chat/rooms/group', { name, participantIds });
    return response.data;
};

export const useNewGroupChat = (onSuccess?: (room: ChatRoom) => void) => {
    const queryClient = useQueryClient();

    // 상호 팔로우 사용자 목록을 가져오는 쿼리 (useNewChat 훅과 캐시 공유)
    const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery<User[]>({
        queryKey: ['mutualUsers'],
        queryFn: fetchMutualUsers,
        staleTime: 5 * 60 * 1000,
    });

    // 그룹 채팅방을 생성하는 뮤테이션
    const { mutate: createChat, isPending: isCreatingChat } = useMutation({
        mutationFn: createGroupChat,
        onSuccess: (newRoom) => {
            queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
            if (onSuccess) {
                onSuccess(newRoom);
            }
        },
        onError: (error) => {
            console.error("그룹 채팅방 생성 실패:", error);
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
