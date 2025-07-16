
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import chatApi from '@/features/chat/api/chat-api';
import { Message } from '@/features/chat/types/chat-types';
import { useChat } from './use-chat';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface MessagesPage {
  messages: Message[];
  nextCursor?: string;
}

export const useChatRoom = (roomId: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { optimisticUpdateRoom } = useChat();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['messages', roomId],
    // queryFn의 pageParam 타입을 명시적으로 지정하여 타입 추론 오류를 해결합니다.
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => chatApi.getMessages(roomId, pageParam),
    initialPageParam: undefined,
    // getNextPageParam의 lastPage 타입을 명시적으로 지정합니다.
    getNextPageParam: (lastPage: MessagesPage) => lastPage.nextCursor,
    enabled: !!roomId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => chatApi.sendMessage(roomId, content),
    onMutate: async (content: string) => {
      if (!user) return;

      await queryClient.cancelQueries({ queryKey: ['messages', roomId] });

      const optimisticMessage: Message = {
        id: `optimistic-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        sender: {
          id: user.id,
          nickname: user.nickname,
          avatar: user.avatar,
        },
      };

      queryClient.setQueryData<InfiniteData<MessagesPage>>(
        ['messages', roomId],
        (oldData) => {
          const newData = oldData ? { ...oldData } : { pages: [], pageParams: [] };
          if (newData.pages.length > 0) {
            newData.pages[0].messages = [optimisticMessage, ...newData.pages[0].messages];
          } else {
            newData.pages.push({ messages: [optimisticMessage], nextCursor: undefined });
          }
          return newData;
        }
      );

      optimisticUpdateRoom({
        id: roomId,
        lastMessage: {
          content: content,
          createdAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      });

      return { optimisticMessage };
    },
    onSuccess: (newMessage, _variables, context) => {
      queryClient.setQueryData<InfiniteData<MessagesPage>>(
        ['messages', roomId], 
        (oldData) => {
          if (!oldData) return { pages: [], pageParams: [] };
          
          const newPages = oldData.pages.map((page) => ({
            ...page,
            messages: page.messages.map((msg: Message) =>
              msg.id === context?.optimisticMessage.id ? newMessage : msg
            ),
          }));
          return { ...oldData, pages: newPages };
        }
      );
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData<InfiniteData<MessagesPage>>(
        ['messages', roomId],
        (oldData) => {
            if (!oldData) return { pages: [], pageParams: [] };

            const newPages = oldData.pages.map(page => ({
                ...page,
                messages: page.messages.filter(
                    (msg: Message) => msg.id !== context?.optimisticMessage.id
                )
            }));
            return { ...oldData, pages: newPages };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
  });

  const messages = data?.pages.flatMap((page) => page.messages) ?? [];

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
