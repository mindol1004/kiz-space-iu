
import { apiClient } from '@/lib/axios-config';
import { ChatRoom, Message } from '@/features/chat/types/chat-types';

interface GetMessagesResponse {
  messages: Message[];
  nextCursor?: string;
}

const chatApi = {
  /**
   * 현재 사용자가 참여중인 모든 채팅방 목록을 가져옵니다.
   */
  getChatRooms: async (): Promise<ChatRoom[]> => {
    // apiClient의 baseURL이 /api이므로, 여기서는 /api를 제외한 경로를 사용합니다.
    const response = await apiClient.get<ChatRoom[]>('/chat/rooms');
    return response.data;
  },

  /**
   * 특정 채팅방의 메시지 목록을 페이지네이션하여 가져옵니다.
   * @param roomId - 채팅방 ID
   * @param cursor - 다음 페이지를 위한 커서 ID
   */
  getMessages: async (roomId: string, cursor?: string): Promise<GetMessagesResponse> => {
    // apiClient의 baseURL이 /api이므로, 여기서는 /api를 제외한 경로를 사용합니다.
    const response = await apiClient.get<GetMessagesResponse>(`/chat/rooms/${roomId}`, {
      params: { cursor },
    });
    return response.data;
  },

  /**
   * 특정 채팅방에 메시지를 전송합니다.
   * @param roomId - 메시지를 보낼 채팅방 ID
   * @param content - 메시지 내용
   */
  sendMessage: async (roomId: string, content: string): Promise<Message> => {
    // apiClient의 baseURL이 /api이므로, 여기서는 /api를 제외한 경로를 사용합니다.
    const response = await apiClient.post<Message>(`/chat/rooms/${roomId}/messages`, { content });
    return response.data;
  },
};

export default chatApi;
