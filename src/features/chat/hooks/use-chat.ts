
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import chatApi from '@/features/chat/api/chat-api';
import { ChatRoom } from '@/features/chat/types/chat-types';

export const useChat = () => {
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading, error } = useQuery<ChatRoom[]>({
    queryKey: ['chatRooms'],
    queryFn: chatApi.getChatRooms,
  });

  const optimisticUpdateRoom = (updatedRoom: Partial<ChatRoom> & { id: string }) => {
    queryClient.setQueryData<ChatRoom[]>(['chatRooms'], (oldRooms = []) => {
      return oldRooms.map(room =>
        room.id === updatedRoom.id ? { ...room, ...updatedRoom } : room
      ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    });
  };

  return {
    rooms,
    isLoading,
    error,
    optimisticUpdateRoom,
  };
};
